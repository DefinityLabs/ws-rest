import request from 'request-promise';

class RestRepository {
  echo(number) {
    return request({
      uri:'http://localhost:8080/echo/' + number,
      json: true
    });
  }
}

export default RestRepository;
