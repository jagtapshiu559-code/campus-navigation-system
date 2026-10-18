
from flask import Flask, render_template, request, redirect, url_for, flash
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
app.secret_key = "campus-navigation-secret-key"

# MySQL Database Connection
DB_CONFIG = {
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": "admin123",
    "database": "campus_navigation"
}


def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/route")
def route_page():
    return render_template("route.html")


@app.route("/explore")
def explore():
    return render_template("explore.html")


@app.route("/feedback", methods=["GET", "POST"])
def feedback():
    if request.method == "POST":
        name = request.form.get("name", "").strip() or "Anonymous"
        rating = request.form.get("rating", "").strip()
        message = request.form.get("message", "").strip()

        try:
            rating = int(rating)
        except (ValueError, TypeError):
            rating = 0

        if rating not in range(1, 6) or not message:
            flash("Please select a rating and enter feedback.", "error")
            return redirect(url_for("feedback"))

        connection = None
        cursor = None

        try:
            connection = get_db_connection()
            cursor = connection.cursor()

            cursor.execute(
                "INSERT INTO feedback (name, rating, message) VALUES (%s, %s, %s)",
                (name, rating, message)
            )
            connection.commit()

            flash("Thank you! Feedback saved successfully.", "success")

        except Error:
            if connection and connection.is_connected():
                connection.rollback()

            app.logger.exception("MySQL feedback error")
            flash("Database error. Check your MySQL password and connection.", "error")

        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()

        return redirect(url_for("feedback"))

    return render_template("feedback.html")


if __name__ == "__main__":
    app.run(debug=True)
