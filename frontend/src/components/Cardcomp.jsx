import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "../Cardcomp.css"

function Cardcomp(props) {
  return (
    <Card className="card" style={{ width: '18rem', border: "3px solid #133E87", borderRadius: "10px" }}>
      <Card.Img variant="top" src={props.imgurl} style={{borderBottom: "3px solid #133E87", height: "40%", objectFit: "cover"}} />
      <Card.Body style={{marginBottom: 0, paddingBottom: "0"}}>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text style={{marginBottom: 0}}>
          {props.text}
        </Card.Text >
      </Card.Body>
    </Card>
  );
}

export default Cardcomp;