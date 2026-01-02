from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services import answer_question

@api_view(['POST'])
def ask_question(request):
    query = request.data.get("query")
    answer = answer_question(query)
    return Response({"answer": answer})
