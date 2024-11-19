from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Record(db.Model):
    __tablename__ = 'records'

    id = db.Column(db.String(50), primary_key=True)  # ID from thhe dataset
    aggregate_sentence_months = db.Column(db.Integer, nullable=False)
    sentence_type = db.Column(db.String(100), nullable=False)
    eligible = db.Column(db.Boolean, nullable=False)
    eligibility_score = db.Column(db.Float, nullable=False)

    # relaciones
    prior_offenses = db.relationship('PriorOffense', backref='record', cascade='all, delete-orphan')
    current_offenses = db.relationship('CurrentOffense', backref='record', cascade='all, delete-orphan')


class PriorOffense(db.Model):
    __tablename__ = 'prior_offenses'

    id = db.Column(db.Integer, primary_key=True)
    offense = db.Column(db.String(255), nullable=False)
    record_id = db.Column(db.String(50), db.ForeignKey('records.id'), nullable=False)


class CurrentOffense(db.Model):
    __tablename__ = 'current_offenses'

    id = db.Column(db.Integer, primary_key=True)
    offense = db.Column(db.String(255), nullable=False)
    record_id = db.Column(db.String(50), db.ForeignKey('records.id'), nullable=False)
