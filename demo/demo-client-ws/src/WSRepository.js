import {wsRestClient} from 'ws-rest';

class WSRepository {
  echo(number) {
    return wsRestClient.send({url: 'http://localhost:8080/echo/' + number, method: 'GET'});
  }
}

export default WSRepository;
