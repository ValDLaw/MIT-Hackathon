from app import create_app, db
from app.utils import load_data

app = create_app()
with app.app_context():
    load_data('./app/data/updated_dataset_dict.json')


