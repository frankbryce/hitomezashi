from flask import Flask, render_template
from flask_frozen import Freezer
from app import app

app = Flask(__name__)
app.config['FREEZER_DESTINATION'] = 'static-app/'
app.config['FREEZER_BASE_URL'] = f'http://localhost/hitomezashi/projects/{app.config["FREEZER_DESTINATION"]}'
freezer = Freezer(app)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    freezer.freeze()
