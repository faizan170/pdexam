import email
import smtplib
import os


def send_email(to, subject, body):
    """
    Send 
    """
    try:
        msg = email.message.EmailMessage()
        msg['From'] = os.getenv("MAIL_USERNAME")
        msg['To'] = to
        msg['Subject'] = subject
        
        msg.set_content(body, subtype='html')

        s = smtplib.SMTP(os.getenv("MAIL_HOST"), 587)
        s.ehlo() # Hostname to send for this command defaults to the fully qualified domain name of the local host.
        s.starttls() #Puts connection to SMTP server in TLS mode
        s.ehlo()
        s.login(os.getenv("MAIL_USERNAME"), os.getenv("MAIL_PASSWORD"))

        s.sendmail(to, to, msg.as_string())

        s.quit()
        return True
    except Exception as ex:
        print(ex)
        return False