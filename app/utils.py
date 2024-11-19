import json
from app.models import Record, PriorOffense, CurrentOffense
from app import db, create_app

def load_data(file_path):
    with open(file_path) as f:
        data = json.load(f)

    for record_id, record_data in data.items():
        record = Record(
            id=record_id,
            aggregate_sentence_months=record_data['aggregate_sentence_months'],
            sentence_type=record_data['sentence_type'],
            eligible=bool(record_data['eligible']),
            eligibility_score=record_data['eligibility_score']
        )
        db.session.add(record)
        db.session.flush() 

        # add prior offenses
        for offense in record_data['prior_offenses']:
            db.session.add(PriorOffense(offense=offense, record_id=record.id))

        # add current offenses
        for offense in record_data['current_offenses']:
            db.session.add(CurrentOffense(offense=offense, record_id=record.id))

    db.session.commit()
