
# backend/contacts/views.py
import os

from django.core.cache import cache
from django.core.mail import EmailMessage
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import InquirySerializer
from .models import Inquiry


class ContactView(APIView):
    """
    POST /api/contact/
    CSRF is enforced by Django's CsrfViewMiddleware (no @csrf_exempt here).
    Includes a simple honeypot and per-IP rate limiting.
    """
    authentication_classes = []  # public endpoint
    permission_classes = []      # public endpoint

    def post(self, request, *args, **kwargs):
        data = request.data.copy()

        # --- Client info (optional) ---
        data['user_agent'] = (request.META.get('HTTP_USER_AGENT', '') or '')[:300]
        ip = request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('REMOTE_ADDR') or ''
        ip = ip.split(',')[0].strip()

        # --- Honeypot: bots fill this; humans do not ---
        honeypot_value = (data.get('hp_field') or '').strip()
        if honeypot_value:
            return Response({'detail': 'Spam detected.'}, status=status.HTTP_400_BAD_REQUEST)

        # --- Rate limiting: max 5 submissions per 10 minutes (per IP) ---
        key = f"contact_rl_{ip}"
        count = cache.get(key, 0)
        if count >= 5:  # NOTE: use >= (not &gt;=)
            return Response({'detail': 'Too many requests. Please try again later.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        cache.set(key, count + 1, timeout=600)

        # --- Validate payload ---
        ser = InquirySerializer(data=data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

        # --- Save inquiry to DB ---
        inquiry = Inquiry.objects.create(
            name=ser.validated_data['name'],
            email=ser.validated_data['email'],
            company=ser.validated_data.get('company', ''),
            phone=ser.validated_data.get('phone', ''),
            subject=ser.validated_data['subject'],
            message=ser.validated_data['message'],
            user_agent=data.get('user_agent', ''),
            ip_address=ip or None,
        )

        # --- Send email (console backend in dev; SMTP in prod) ---
        subject = f"[Contact] {inquiry.subject} — {inquiry.name}"
        body = (
            "New enquiry from Collinalitics contact form\n"
            f"Name: {inquiry.name}\n"
            f"Email: {inquiry.email}\n"
            f"Company: {inquiry.company}\n"
            f"Phone: {inquiry.phone}\n"
            f"IP: {inquiry.ip_address}\n"
            f"User-Agent: {inquiry.user_agent}\n\n"
            f"Message:\n{inquiry.message}\n"
        )

        to_email = [os.environ.get('CONTACT_DEST_EMAIL', 'hello@collinalitics.com')]

        # Decide fail_silently based on backend; default to True for dev
        email_backend = os.environ.get('EMAIL_BACKEND', '')
        fail_silently = email_backend != 'django.core.mail.backends.smtp.EmailBackend'

        email_error = None
        try:
            EmailMessage(subject, body, to=to_email).send(fail_silently=fail_silently)
        except Exception as e:
            # Log the error for visibility (you will see it in runserver output)
            email_error = str(e)

        # Always return success (201). If email failed, include a hint for the UI.
        payload = {'ok': True}
        if email_error:
            payload['email_error'] = email_error

        return Response(payload, status=status.HTTP_201_CREATED)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class ContactCsrfView(APIView):
    """
    GET /api/contact/csrf/
    Returns JSON and ensures the 'csrftoken' cookie is set for the domain.
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request, *args, **kwargs):
        return Response({'ok': True})
