import React from "react";
import {
  Container, Row, Col, Card,
  CardHeader,
  Badge,
  ListGroup,
  ListGroupItem,
  Form,
  Button,
  CardBody,
  Alert
} from "shards-react";

import SmallStats from "../components/common/SmallStats";
import PageTitle from "../components/common/PageTitle";
import RoomIcon from '@material-ui/icons/Room';
import RangeDatePicker from "../components/common/RangeDatePicker";
import StarIcon from '@material-ui/icons/Star';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import axios from "axios";
import { API_URL } from "../config";

const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

function getReadableDate(isoDate) {
  var date = new Date(isoDate);
  return date.getDate()+' ' + months[date.getMonth()] + ' '+date.getFullYear(); // prints expected format.
};

class ProductPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      product: {
        ID: "",
        name: "",
        photos: [''],
        description: "",
        price: 0,
        tags: [],
        timeduration: { Start: "", End: "" },
        userID: ""
      },
      estimate: "",
      productID: this.props.match.params.id || this.props.location.pathname.split("/")[2],
      alertmsg: "",
    };
    this.datepicker = undefined;
    console.log(this.props.location.pathname.split("/")[2]);
    this.getProductAndSeller = this.getProductAndSeller.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getProductAndSeller() {
    axios.get(API_URL + '/products/' + this.state.productID, { withCredentials: true })
      .then((response) => {
        if (response.data != null) {
          console.log('response', response);
          this.setState({ product: response.data });
          this.setState({ estimate: this.state.product.price});
        }
      })
      .catch((error) => {
        console.log("Error in doing post request" + error.response);
        if(error.response !== undefined) {
          if(error.response.status == 401) {
            this.setState({ alertmsg: "User is not logged in."});
            setTimeout(function () {
              window.location = "/login";
            }, 500);
          } else {
            this.setState({ alertmsg: "Error happened in fetching product : " + error.response.data.message});
          }
        }
      });
  }

  componentDidMount() {
    this.getProductAndSeller();
  }

  onChange(item) {
    console.log('this', this);
    console.log('item', item);
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('datepicker', this.datepicker);
    var timeduration = {Start: this.datepicker.state.startDate, End: this.datepicker.state.endDate};
    var sellerID = this.state.product.userID;
    var productID = this.state.productID;
    axios(API_URL + '/orders', {
      method: "post",
      withCredentials: true,
      data: {
        productID: productID,
        sellerID: sellerID,
        timeduration: timeduration
      }
    })
      .then((response) => {
        if (response.data != null) {
          console.log(response.data);
          this.setState({ alertmsg: response.data.message + ' Redirecting in a while ...' });
          setTimeout(() => {
            this.props.history.push("/users")
          }, 2500);
        }
      })
      .catch((error) => {
        console.log(error.response);
        if(error.response !== undefined) {
          if(error.response.status == 401) {
            this.setState({ alertmsg: "User is not logged in."});
            setTimeout(function () {
              window.location = "/login";
            }, 500);
          } else {
            this.setState({ alertmsg: "Error happened in renting product : " + error.response.data.message});
          }
        }
      });
  }

  render() {
    const {
      product,
      alertmsg
    } = this.state;

    return (
      <Container fluid className="main-content-container px-4">
        {alertmsg && <Alert className="mb-0" id="alertmsg">{alertmsg}</Alert>}

        <Row noGutters className="page-header py-4">
          <PageTitle title={product.name} subtitle="Product Details" md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row>
          {/* Photos & Price*/}
          <Col lg="5">
            <Card>
              <CardHeader className="text-center border-bottom">
                <div
                  className="card-post__image"
                  style={{ backgroundImage: `url(${product.photos[0]})`, height: "500px" }}
                >
                  <div style={{ float: "right", width: "50px" }}>
                    {product.tags.map((item) => <Badge
                      pill
                      className={`card-post__category`} style={{ marginTop: "5px", float: "right" }}
                    >{item}</Badge>)}
                  </div>
                </div>
              </CardHeader>
              <CardBody style={{fontWeight: "700", fontSize: "1.5rem", textAlign: "center"}}>
                円 {product.price} <span style={{fontSize: "1rem"}}>/ day</span>
                {/* ¥ */}
              </CardBody>
            </Card>
          </Col>

          {/* Product details */}
          <Col lg="7">
            <Card small className="mb-4">
              <ListGroup flush>
                {/* Description and availability */}
                <ListGroupItem>
                  <Row>
                    {/* Description */}
                    <Col md="12">
                      <label htmlFor="feDescription">Description</label>
                      <br />
                      {product.description}

                      <br /><br />
                      <Row>
                        <Col md="3">
                          <label>Availability</label>
                        </Col>
                        <Col md="3">
                          {getReadableDate(product.timeduration.Start)}
                        </Col>
                        <Col md="3">-</Col>
                        <Col md="3">
                          {getReadableDate(product.timeduration.End)}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  {/* Edit button only visible to seller */}
                  {/* <Button theme="accent">Update Account</Button> */}
                </ListGroupItem>

                {/* Buying options */}
                <ListGroupItem>
                  <Row>
                    <Col>
                      <Form>
                        <Row form>
                          <Col md="6" className="form-group">
                            <label>Rent it!</label>
                            <br />
                            <RangeDatePicker ref={(ref) => this.datepicker = ref}  onClick={this.onChange}/>
                          </Col>
                          <Col md="3" style={{textAlign: "right" }}>
                            <label>Rent</label>
                            <br />
                            <span id="rentEstimate" style={{fontSize: "2rem"}}>{this.state.estimate}</span>
                          </Col>
                        </Row>
                        <Button onClick={this.handleSubmit} theme="accent">Place Order</Button>
                      </Form>
                    </Col>
                  </Row>
                </ListGroupItem>

                {/* Seller and interest */}
                <ListGroupItem>
                  <Row>
                    {/* Representative views interest graph */}

                    {/*  Seller info*/}
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ProductPage;
