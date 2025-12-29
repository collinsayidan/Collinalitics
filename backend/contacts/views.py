
from django.core.mail import EmailMessage
from django.views.decorators.csrf import csrf_exempt  # dev: simple
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import InquirySerializer
from .models import Inquiry

@method_decorator(csrf_exempt, name='dispatch')  # DEV ONLY: remove once CSRF wired
class ContactView(APIView):
    """
    POST /api/contact/
    """
    authentication_classes = []  # public endpoint
    permission_classes = []      # public endpoint

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        # store client info
        data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')[:300]
        ip = request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('REMOTE_ADDR')
        ip = (ip or '').split(',')[0].strip()
        # Create DB record
        ser = InquirySerializer(data=data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

        inquiry = Inquiry.objects.create(
            name=ser.validated_data['name'],
            email=ser.validated_data['email'],
            company=ser.validated_data.get('company', ''),
            phone=ser.validated_data.get('phone', ''),
            subject=ser.validated_data['subject'],
            message=ser.validated_data['message'],
            user_agent=data.get('user_agent', '')[:300],
            ip_address=ip or None,
        )

        # Send email (dev: console backend; prod: SMTP)
        subject = f"[Contact] {inquiry.subject} — {inquiry.name}"
        body = (
            f"New enquiry from Collinalitics contact form\n"
            f"Name: {inquiry.name}\n"
            f"Email: {inquiry.email}\n"
            f"Company: {inquiry.company}\n"
            f"Phone: {inquiry.phone}\n"
            f"IP: {inquiry.ip_address}\n"
            f"User-Agent: {inquiry.user_agent}\n\n"
            f"Message:\n{inquiry.message}\n"
        )
        # Update to your real destination email
        to_email = ["hello@collinalitics.com"]
        EmailMessage(subject, body, to=to_email).send(fail_silently=True)

        return Response({'ok': True}, status=status.HTTP_201_CREATED)
# Note: In production, ensure proper CSRF protection and authentication as needed.