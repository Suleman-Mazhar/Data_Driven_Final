from api import create_app
from api.config.db import test_connection

app = create_app()

@app.route('/health')
def health_check():
    db_status = "Connected" if test_connection() else "Disconnected"
    return {
        "status": "online",
        "database": db_status
    }

if __name__ == '__main__':
    app.run(debug=True)