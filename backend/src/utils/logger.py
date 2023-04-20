import logging
import os
from logging import FileHandler

if not os.path.exists('logs'):
    os.makedirs('logs', exist_ok=True)

error_logger = logging.getLogger('error_logger')
info_logger = logging.getLogger('info_logger')


error_logger.setLevel(logging.ERROR)
info_logger.setLevel(logging.INFO)

errLog_handler = FileHandler('logs/error.log', delay=True)
infoLog_handler = FileHandler('logs/info.log', delay=True)

errLog_handler.setFormatter(logging.Formatter('%(asctime)s | %(filename)s:%(funcName)s:%(lineno)d | %(message)s'))
infoLog_handler.setFormatter(logging.Formatter('%(asctime)s | %(filename)s:%(funcName)s:%(lineno)d | %(message)s'))


error_logger.addHandler(errLog_handler)
info_logger.addHandler(infoLog_handler)