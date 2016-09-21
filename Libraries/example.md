# Trello.js

### Example code for adding card to a list

```javascript
function main() {
  var key = 'YOUR_KEY';
  var token = 'YOUR_TOKEN';
  var trello = new Trello(key, token);
  
  var list = trello.get('boards/[board_id]/lists', function(err, data) {
    // Here you might actually wanna return something
    // else than the first list in the response.
    return data[0];
  });
  
  var newCard = {
    name: 'Card from AdWords Scripts',
    desc: 'Lorem ispum dolor sit amet, si tu amerone flay heaton.',
    idList: list.id,
    pos: 'top'
  };

  trello.post('/cards/', newCard);
  
}

/* Include Trello.js */
```
