
d:
cd %cd%
openssl req -newkey rsa:2048 -nodes -keyout %cd%\\private.pem -x509 -days 3650 -out %cd%\\certificate.pem