import re


def isAllPresent(password):
    """ Check if password contains Lowercase, Uppercase, Number, and Special Character
    Args:
        password (str): user password
    Returns:
        bool: True if valid, False if not
     """
 
    # ReGex to check if a string
    # contains uppercase, lowercase
    # special character & numeric value
    regex = ("^(?=.*[a-z])(?=." +
             "*[A-Z])(?=.*\\d)" +
             "(?=.*[-+_!@#$%^&*., ?]).+$")
     
    # Compile the ReGex
    p = re.compile(regex)
 
    # Print Yes if string
    # matches ReGex
    return re.search(p, password)


def validate_password(password):
    # check if password is greater than 8 characters
    if len(password) < 8:
        return "Password must be at least 8 characters"
    
    # check if password contains Lowercase, Uppercase, Number, and Special Character
    if not isAllPresent(password):
        return "Password must contain at least one lowercase, uppercase, number, and special character"
    return True


def validate_signup_data(data):
    """ Check if the data is valid 
    Args:
        data: dict 
    Returns:
        bool: True if valid, False if not
    """
    for field in ['name', 'email', 'password']:
        if data.get(field) in [None, '']:
            return "Missing {} field".format(field)
    
    # check if email is valid email using regex
    if not re.match(r"[^@]+@[^@]+\.[^@]+", data['email']):
        return {"email" : "Invalid email address"}

    resp_pass = validate_password(data['password'])
    if resp_pass != True: # Password is not valid, return is dict
        return resp_pass

    return True


def validate_login_data(useremail, password):
    """ Check if the data is valid 
    Args:
        data: dict 
    Returns:
        bool: True if valid, False if not
    """
    if useremail in ['', None]:
        return {"email" : "Invalid email address"}
    if password in ['', None]:
        return {"password" : "Invalid password"}
    return True
