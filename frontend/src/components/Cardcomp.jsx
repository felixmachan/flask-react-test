import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function Cardcomp(props) {
  return (
    <Card style={{ width: '18rem', border: "5px solid #133E87", borderRadius: "10px" }}>
      <Card.Img variant="top" src={props.imgurl} />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          {props.text}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Cardcomp;