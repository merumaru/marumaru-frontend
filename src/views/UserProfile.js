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
import axios from "axios";
import { API_URL } from "../config";
import Cookies from 'universal-cookie';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var today = new Date();
var defaultOrders = [{
  ID: "99",
  SellerID: "1",
  BuyerID: "2",
  ProductID: "3",
  TimeDuration: { Start: "2019-11-03T08:04:33+0900", End: "2019-11-30T17:03:30+0900" },
  isCancelled: false
}];

function getReadableDate(isoDate) {
  var date = new Date(isoDate);
  return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();//prints expected format.
};

function getOrderStatus(order) {
  var end = new Date(order.timeduration.End)
  if (order.isCancelled) {
    return ["Cancelled", "bg-danger"];
  }
  else if (end < today) {
    return ["Completed", "bg-success"];
  }
  else if (end > today) {
    return ["Rented", "bg-warning"];
  }
  return ["-1", "bg-dark"];
}

function getProductStatus(product, orders) {
  if (orders === defaultOrders || orders == null) {
    return ["Available", "bg-success"];
  }
  // get orders with this product id, and then choose the latest one
  var matchingOrders = orders.filter(x => x.ProductID === product.ID)
  var latestOrder = matchingOrders.sort((a, b) => new Date(b.timeduration.start) - new Date(a.timeduration.start))[0]

  if (!latestOrder || latestOrder.isCancelled) {
    // no order, or last order cancelled
    return ["Available", "bg-success"];
  }
  var endDate = new Date(latestOrder.timeduration.End)
  if (endDate > today) {
    return ["Rented", "bg-warning"];
  }
  return ["-1", "bg-dark"];
}

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        name: "Stan Lee",
        ID: "1",
        address: "In your heart",
        email: "stantheman@gmail.com",
        phonenumber: "911",
        avatar: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/stan-lee-arrives-at-the-premiere-of-disney-and-marvels-news-photo-950501274-1542049801.jpg?crop=1.00xw:0.512xh;0,0.0630xh&resize=480:*'
      },
      products: [
      ],
      orders: [],
      orderproducts: [],
      userID: this.props.match.params.id || localStorage.getItem("userID")
    };

    const cookies = new Cookies();
    var token = cookies.get('token');
    var jwt = require("jsonwebtoken");
    var decode = jwt.decode(token);
    this.state.userID = decode.id;
    this.state.userName = decode.username;
  }

  getUserProfile() {

    console.log('Fetching information for id', this.state.userID);
    axios.get(API_URL + '/users/' + this.state.userID, { withCredentials: true })
      .then((response) => {
        console.log('user info', response);
        this.setState({ user: response.data });

        // get orders with user involved
        axios.get(API_URL + '/users/' + this.state.userName + "/orders", { withCredentials: true })
          .then((response) => {
            console.log('Populating orders for', this.state.userID, response.data);
            if (response.data) {
              this.setState({ orders: response.data });

              // get product details
              var orderproducts = [];
              var length = this.state.orders.length;
              this.state.orders.map((order, key) =>
                axios.get(API_URL + '/products/' + order.productID, { withCredentials: true })
                  .then((resp) => {
                    console.log('Product received', resp.data);
                    length--;
                    if (resp.data) {
                      orderproducts.push(resp.data);
                      // this.setState({orderproducts: this.state.orderproducts.push(resp.data)});
                    }
                    else {
                      console.log(key, ' number of order', response);
                    }
                    // if (length === 0) {
                    //   this.setState({ orderproducts: orderproducts });
                    //   console.log('Orderproducts', this.state.orderproducts);
                    // }
                  })
                  .catch(function (error) { console.log('products fet', error.response); })
              );

              this.setState({ orderproducts: orderproducts });
            }
          })
          .catch(function (error) { console.log(error.response); })
      })
      .catch(function (error) { console.log('user fetch', error.response); });


    // get user products
    axios.get(API_URL + '/users/' + this.state.userName + "/products", { withCredentials: true })
      .then((response) => {
        console.log('Products', response.data);
        if (response.data) {
          this.setState({ products: response.data });
        }
      })
      .catch(function (error) { console.log('products fet', error.response); });

  }

  componentDidMount() {
    this.getUserProfile();
  }

  render() {
    const {
      user,
      products,
      orders,
      orderproducts
    } = this.state;

    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title={user.username} subtitle="User Profile" md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row>
          {/* User info */}
          <Col lg="2">
            <Card small className="mb-4 pt-3">
              <CardHeader className="border-bottom text-center">
                <div className="mb-3 mx-auto">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    width="175"
                  />
                </div>
                <h4 className="mb-0">{user.username}</h4>
              </CardHeader>
              <ListGroup flush>
                <ListGroupItem className="px-4">
                  <EmailIcon />: {user.email}
                </ListGroupItem>
                <ListGroupItem className="px-4">
                  <PhoneIcon />: {user.phonenumber}
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
                      <a href={"/products/" + product.ID}>
                        <img src={product.photos[0]} style={{ width: "50px", height: "50px" }} />
                      </a>
                    </Col>
                    <Col lg="5">
                      <a href={"/products/" + product.ID}>
                        {product.name}
                      </a>
                    </Col>
                    <Col lg="3">
                      {getReadableDate(product.timeduration.Start)} - {getReadableDate(product.timeduration.End)}
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
                <ListGroupItem>{orderproducts}</ListGroupItem>
                {/* {orderproducts.map((product) => <ListGroupItem>
                  <Row>

                    <Col lg="2">
                      <a href={"/products/" + product.ID}>
                        <img src={product.photos[0]} style={{ width: "50px", height: "50px" }} />
                      </a>
                    </Col>
                    <Col lg="5">
                      <a href={"/products/" + product.ID}>
                        {product.name} NAME
                        </a>
                    </Col>
                    <Col lg="3">
                      {getReadableDate(product.timeduration.Start)} - {getReadableDate(product.timeduration.End)}
                    </Col>
                    <Col lg="2">
                      <Badge className={getOrderStatus(product)[1]}>{getOrderStatus(product)[0]}</Badge>
                    </Col>
                  </Row>
                </ListGroupItem>)} */}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default UserProfile;
