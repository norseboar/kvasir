from app.models import User

from app.password_util import hash_password, validate_password

from flask import session, request, redirect, url_for

from app.session_util import is_user_logged_in, create_session, delete_session

class HomeController():
    def handle(self):
        if not is_user_logged_in():
            return redirect(url_for('login'))

        email = session['email']
        user = User.query.filter(User.email == email).one()
        return f"Hello, {user.email}!"

class LoginController():
    def handle(self):
        req_data = request.form
        email = req_data['email']
        password = req_data['password']

        user = User.query.filter(User.email == email).one_or_none()

        if not user:
            delete_session()
            return "No user found!"

        password_hash = user.password_hash
        is_password_valid = validate_password(password, password_hash)
        if (is_password_valid):
            create_session(email)
            return redirect(url_for('home'))
        else:
            delete_session()
            return "Hacker detected! FBI enroute."

class LoginPageController():
    def handle(self):
          return '''<form method="POST">
                  Email: <input type="text" name="email"><br>
                  Password: <input type="password" name="password"><br>
                  <input type="submit" value="Submit"><br>
              </form>'''
