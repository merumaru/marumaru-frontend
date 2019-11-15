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
  return date.getDate()+' ' + months[date.getMonth()] + ' '+date.getFullYear();//prints expected format.
};

class ProductPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      product: {
        ID: "-1",
        name: "Marimekko Puketti Tote Bag",
        photos: ['https://static.mercdn.net/item/detail/orig/photos/m58195644191_1.jpg?1573368650'],
        description: "It is a tote bag purchased 4-5 years ago. It is a bag that was used only for going to yoga for about half a year. Vertical 32 ㎝ Horizontal 44 ㎝ Town width 13 フ ァ ス ナ ー Opening fastener One inside pocket for half a year, and then purchase it with a person who understands that it was stored at home. I will ship as compact as possible. Please acknowledge m (_ _) m. I will change the amount of money while watching the situation.",
        price: 123.45,
        tags: ["Bags", "Fashion"],
        timeduration: { Start: "2019-11-03T08:04:33+0900", End: "2019-11-30T17:03:30+0900" },
        userID: "-1",
        // https://timestampgenerator.com/1572562929/+09:00
        // run a check for availability once
      },
      seller: {},
      stats: {
        label: "Product Views",
        value: "182",
        percentage: "12.4%",
        increase: true,
        chartLabels: [null, null, null, null, null, null, null],
        attrs: { md: "6", sm: "6" },
        datasets: [
          {
            label: "Today",
            fill: "start",
            borderWidth: 1.5,
            backgroundColor: "rgba(23,198,113,0.1)",
            borderColor: "rgb(23,198,113)",
            data: [1, 2, 3, 3, 3, 4, 4]
          }
        ]
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
    axios.get(API_URL + '/products/' + this.state.productID)
      .then((response) => {
        console.log('response', response);
        this.setState({ product: response.data });
        this.setState({ estimate: this.state.product.price});
        axios.get(API_URL + '/users/' + this.state.product.userID)
        .then((response) => {
          console.log('Seller', response.data);
          this.setState({ seller: response.data });
        })
        .catch(function (error) { console.log(error); })
      })
      .catch(function (error) { console.log(error.response); })

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
    var buyerID = localStorage.getItem('userID');
    var sellerID = this.state.product.userID;
    var productID = this.state.productID;
    if (buyerID === sellerID) {
      this.setState({ alertmsg: "Cannot buy your own product !"});
    }
    else {
      axios.post(API_URL + '/orders', {
        productID: productID,
        sellerID: sellerID,
        buyerID: buyerID,
        timeduration: timeduration
      })
        .then((response) => {
          console.log(response.data);
          this.setState({ alertmsg: response.data.message + ' Redirecting in a while ...' });
          setTimeout(() => {
            this.props.history.push("/users")
          }, 2500);
        })
        .catch((error) => {
          console.log(error.response);
          this.setState({ alertmsg: error.response.data.message });
        });
    }
  }

  render() {
    const {
      product,
      seller,
      stats,
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
                <span style={{float: "right", fontSize: "small"}}>
                  <StarIcon color="primary"/><StarIcon color="primary"/><StarIcon color="primary"/><StarHalfIcon color="primary"/><StarBorderIcon color="primary"/>
                  </span>
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
                    <Col lg="5">
                      <SmallStats
                        id={`interest`}
                        variation="1"
                        chartData={stats.datasets}
                        chartLabels={stats.chartLabels}
                        label={stats.label}
                        value={stats.value}
                        percentage={stats.percentage}
                        increase={stats.increase}
                        decrease={stats.decrease}
                      />
                    </Col>

                    {/*  Seller info*/}
                    <Col lg="7">
                      <Card className="card-post card-post--aside card-post--1">
                        <a href={"/users/" + seller.ID} className="text-fiord-blue">
                          <div
                            className="card-post__image"
                            style={{ backgroundImage: `url('${seller.avatar}')`, height: "20px !important", maxWidth: "140px !important" }}
                          >
                          </div>
                        </a>
                        <CardBody>
                          <span className="text-muted">Seller</span>
                          <h5 className="card-title">
                            <a className="text-fiord-blue" href={"/user/" + seller.ID}>
                              {seller.username}

                              <br />
                              <span className="text-muted"><RoomIcon />: {seller.address}</span>
                            </a>
                          </h5>
                        </CardBody>
                      </Card>
                    </Col>
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
