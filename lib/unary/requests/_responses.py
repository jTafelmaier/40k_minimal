

import requests

from lib.unary.main import unary




# TODO refactor: move
def to_text_response(text_encoding:str = None):

    @unary()
    def inner(
        response:requests.Response):

        if text_encoding is not None:
            response.encoding = text_encoding

        return response.text

    return inner

