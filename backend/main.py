import os
from flask import jsonify, render_template, send_from_directory
from config import app, socket_app
from flask_swagger import swagger
from routes import user, authentication

@socket_app.on('connect')
def connect():
    print("connected")


@socket_app.on('disconnect')
def disconnect():
    print("disconnected")


@app.route("/")
def index():
    return render_template("index.html")

authorizations = {
    'apiKey': {
        # http security scheme
        'type': 'apiKey',
        "scheme": "bearer",
        'in': 'header',
        'name': 'Authorization',
        'description': "Type in the *'Value'* input box below: **'Bearer &lt;JWT&gt;'**, where JWT is the token"
    }
}


@app.route("/swagger")
def api():
    swag = swagger(app, from_file_keyword="swagger_from_file")
    swag['info']['version'] = "1.0"
    swag['info']['title'] = "Audio API"

    # add authorizations to swagger
    swag['securityDefinitions'] = {
        "api_key": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    }


    return jsonify(swag)


# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def serve(path):
#     if path != "" and os.path.exists(app.static_folder + '/' + path):
#         return send_from_directory(app.static_folder, path)
#     else:
#         return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    #app.run(debug=True, host='0.0.0.0', port=8080)
    socket_app.run(app, debug=True, host='0.0.0.0', port=8080, allow_unsafe_werkzeug=True)