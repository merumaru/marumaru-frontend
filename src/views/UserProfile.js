import React from "react";
import {
  Container, Row, Col, Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Badge,
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import EmailIcon from '@material-ui/icons/Email';
import RoomIcon from '@material-ui/icons/Room';
import PhoneIcon from '@material-ui/icons/Phone';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StorefrontIcon from '@material-ui/icons/Storefront';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var today = new Date();

function getReadableDate(isoDate) {
  var date = new Date(isoDate);
  return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();//prints expected format.
};

function getOrderStatus(order) {
  var start = new Date(order.TimeDuration.start)
  var end = new Date(order.TimeDuration.End)
  if(order.isCancelled) {
    return ["Cancelled", "bg-danger"];
  }
  else if (end < today) {
    return ["Completed", "bg-success"];
  }
  else if(end > today) {
    return ["Rented", "bg-warning"];
  }
  return ["-1", "bg-dark"];
}

function getProductStatus(product, orders) {
  // get orders with this product id, and then choose the latest one
  var matchingOrders= orders.filter(x => x.ProductID === product.ID)
  var latestOrder = matchingOrders.sort((a, b)=> new Date(b.TimeDuration.start) - new Date(a.TimeDuration.start))[0]

  if(!latestOrder || latestOrder.isCancelled) {
    // no order, or last order cancelled
    return ["Available", "bg-success"];
  }
  var endDate = new Date(latestOrder.TimeDuration.End)
  if(endDate > today) {
    return ["Rented", "bg-warning"];
  }
  return ["-1", "bg-dark"];
}

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        Name: "Stan Lee",
        id: "1",
        Address: "In your heart",
        Email: "stantheman@gmail.com",
        Phone: "911",
        avatar: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/stan-lee-arrives-at-the-premiere-of-disney-and-marvels-news-photo-950501274-1542049801.jpg?crop=1.00xw:0.512xh;0,0.0630xh&resize=480:*'
      },
      products: [
        {
          Name: "Marimekko Puketti Tote Bag",
          ID: "1",
          Photos: ['https://static.mercdn.net/item/detail/orig/photos/m58195644191_1.jpg?1573368650'],
          Description: "It is a tote bag purchased 4-5 years ago. It is a bag that was used only for going to yoga for about half a year. Vertical 32 ㎝ Horizontal 44 ㎝ Town width 13 フ ァ ス ナ ー Opening fastener One inside pocket for half a year, and then purchase it with a person who understands that it was stored at home. I will ship as compact as possible. Please acknowledge m (_ _) m. I will change the amount of money while watching the situation.",
          Price: 123.45,
          Tags: ["Bags", "Fashion"],
          TimeDuration: { Start: "2019-11-03T08:04:33+0900", End: "2019-11-30T17:03:30+0900" }
          // https://timestampgenerator.com/1572562929/+09:00
          // run a check for availability once
        },
      ],
      orders: [
        {
          ID: "99",
          SellerID: "1",
          BuyerID: "2",
          ProductID: "3",
          TimeDuration: { Start: "2019-11-03T08:04:33+0900", End: "2019-11-30T17:03:30+0900" },
          isCancelled: false
        },
      ]
    };
  }

  render() {
    const {
      user,
      products,
      orders
    } = this.state;

    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title={user.Name} subtitle="User Profile" md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row>
          {/* User info */}
          <Col lg="2">
            <Card small className="mb-4 pt-3">
              <CardHeader className="border-bottom text-center">
                <div className="mb-3 mx-auto">
                  <img
                    src={user.avatar}
                    alt={user.Name}
                    width="175"
                  />
                </div>
                <h4 className="mb-0">{user.Name}</h4>
              </CardHeader>
              <ListGroup flush>
                <ListGroupItem className="px-4">
                  <EmailIcon />: {user.Email}
                </ListGroupItem>
                <ListGroupItem className="px-4">
                  <RoomIcon />: {user.Address}
                </ListGroupItem>
                <ListGroupItem className="px-4">
                  <PhoneIcon />: {user.Phone}
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>

          {/* Products */}
          <Col lg="5">
            <Card small className="mb-4">
              <CardHeader className="border-bottom text-center">
                <StorefrontIcon /> Products
              </CardHeader>
              <ListGroup flush>
                <ListGroupItem>
                  <Row>
                    <Col lg="7">Product</Col>
                    <Col lg="3">Dates</Col>
                    <Col lg="2">Status</Col>
                  </Row>
                </ListGroupItem>
                {products.map((product) => <ListGroupItem>
                  <Row>

                    <Col lg="2">
                      <a href={"/product/" + product.ID}>
                        <img src={product.Photos} style={{ width: "50px", height: "50px" }} />
                      </a>
                    </Col>
                    <Col lg="5">
                      <a href={"/product/" + product.ID}>
                        {product.Name}
                        </a>
                    </Col>
                    <Col lg="3">
                      {getReadableDate(product.TimeDuration.Start)} - {getReadableDate(product.TimeDuration.End)}
                    </Col>
                    <Col lg="2">
                      <Badge className={getProductStatus(product, orders)[1]}>
                        {getProductStatus(product, orders)[0]}
                      </Badge>
                  </Col>
                  </Row>
                </ListGroupItem>)}
              </ListGroup>
            </Card>
          </Col>

          {/* Orders */}
          <Col lg="5">
            <Card small className="mb-4">
              <CardHeader className="border-bottom text-center">
                <ShoppingCartIcon /> Orders
              </CardHeader>
              <ListGroup flush>
                <ListGroupItem>
                  <Row>
                    <Col lg="7">Product</Col>
                    <Col lg="3">Dates</Col>
                    <Col lg="2">Status</Col>
                  </Row>
                </ListGroupItem>
                {orders.map((order) => <ListGroupItem>
                  <Row>

                    <Col lg="2">
                      <a href={"/product/" + order.ProductID}>
                        <img src={order.Photos} style={{ width: "50px", height: "50px" }} />
                      </a>
                    </Col>
                    <Col lg="5">
                      <a href={"/product/" + order.ID}>
                        {order.Name} NAME
                        </a>
                    </Col>
                    <Col lg="3">
                      {getReadableDate(order.TimeDuration.Start)} - {getReadableDate(order.TimeDuration.End)}
                    </Col>
                    <Col lg="2">
                      <Badge className={getOrderStatus(order)[1]}>{getOrderStatus(order)[0]}</Badge>
                  </Col>
                  </Row>
                </ListGroupItem>)}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default UserProfile;
