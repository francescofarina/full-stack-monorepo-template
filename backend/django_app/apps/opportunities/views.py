from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_dummy_stuff(request):
    data = request.data
    response_dict = {"Dummy response": "The connection is working"}
    return Response(response_dict, status=200)
