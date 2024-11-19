from flask import Blueprint, request, jsonify
from .models import Record
from . import db

bp = Blueprint('api', __name__)
@bp.route('/filter', methods=['GET'])
def filter_data():
    filter_type = request.args.get('filter_type') 
    filter_value = request.args.get('filter_value')
    page = request.args.get('page', 1, type=int) 
    per_page = 10  # default 10

    # sorting by eligibility_score (descending)
    query = Record.query.order_by(Record.eligibility_score.desc())

    # apply filter
    if filter_type and filter_value:
        if filter_type == 'sentence_type':
            query = query.filter_by(sentence_type=filter_value)
        elif filter_type == 'eligible':
            query = query.filter_by(eligible=bool(int(filter_value)))
        elif filter_type == 'eligibility_score':
            query = query.filter(Record.eligibility_score >= float(filter_value))

    # pagination of results
    paginated_query = query.paginate(page=page, per_page=per_page, error_out=False)
    results = paginated_query.items

    data = [{
        'id': record.id,
        'aggregate_sentence_months': record.aggregate_sentence_months,
        'sentence_type': record.sentence_type,
        'eligible': record.eligible,
        'eligibility_score': record.eligibility_score
    } for record in results]

    return jsonify({
        'data': data,
        'page': page,
        'total_pages': paginated_query.pages,
        'total_items': paginated_query.total
    })
