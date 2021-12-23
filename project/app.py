from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import json
import numpy as np
from time import sleep

app = Flask(__name__)
app.config['SECRET_KEY'] = 'TODO - wtf is this?'
socketio = SocketIO(app)

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

def jsEnc(data):
    return json.dumps(data, cls=NpEncoder)

@app.route('/')
def index():
    return render_template('index.html')


def sendRandom(cols, rows):
    emit('json', {
        'colOffsets': jsEnc(np.random.randint(2, size=(cols,))),
        'rowOffsets': jsEnc(np.random.randint(2, size=(rows,))),
    })

# TODO how to send this from the client?
@socketio.on('random')
def onrandom():
    print('send random')
    sendRandom(20,20)


@socketio.on('connect')
def onconnect():
    print('client connected')


@socketio.on('disconnect')
def test_disconnect():
    print('client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True)
