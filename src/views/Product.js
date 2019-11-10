import React from "react";
import {
  Container, Row, Col, Card,
  CardHeader,
  Badge,
  ListGroup,
  ListGroupItem,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  Button,
  CardBody
} from "shards-react";

import SmallStats from "../components/common/SmallStats";
import PageTitle from "../components/common/PageTitle";
import { height, fontWeight } from "@material-ui/system";
import RoomIcon from '@material-ui/icons/Room';
import RangeDatePicker from "../components/common/RangeDatePicker";

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
        Name: "Marimekko Puketti Tote Bag",
        Photos: ['https://static.mercdn.net/item/detail/orig/photos/m58195644191_1.jpg?1573368650'],
        Description: "It is a tote bag purchased 4-5 years ago. It is a bag that was used only for going to yoga for about half a year. Vertical 32 ㎝ Horizontal 44 ㎝ Town width 13 フ ァ ス ナ ー Opening fastener One inside pocket for half a year, and then purchase it with a person who understands that it was stored at home. I will ship as compact as possible. Please acknowledge m (_ _) m. I will change the amount of money while watching the situation.",
        Price: 123.45,
        Tags: ["Bags", "Fashion"],
        TimeDuration: { Start: "2019-11-03T08:04:33+0900", End: "2019-11-30T17:03:30+0900" }
        // https://timestampgenerator.com/1572562929/+09:00
        // run a check for availability once
      },
      seller: {
        id: "1",
        Name: "Stan Lee",
        Address: "In your heart",
        avatar: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/stan-lee-arrives-at-the-premiere-of-disney-and-marvels-news-photo-950501274-1542049801.jpg?crop=1.00xw:0.512xh;0,0.0630xh&resize=480:*'
      },
      stats: {
        label: "Views",
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
      }
    };
  }

  render() {
    const {
      product,
      seller,
      stats
    } = this.state;

    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title={product.Name} subtitle="Product Details" md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row>
          {/* Photos & Price*/}
          <Col lg="5">
            <Card large>
              <CardHeader className="text-center border-bottom">
                <div
                  className="card-post__image"
                  style={{ backgroundImage: `url(${product.Photos[0]})`, height: "500px" }}
                >
                  <div style={{ float: "right", width: "50px" }}>
                    {product.Tags.map((item) => <Badge
                      pill
                      className={`card-post__category`} style={{ marginTop: "5px", float: "right" }}
                    >{item}</Badge>)}
                  </div>
                </div>
              </CardHeader>
              <CardBody style={{fontWeight: "700", fontSize: "1.5rem", textAlign: "center"}}>
                円 {product.Price}
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
                      {product.Description}

                      <br /><br />
                      <Row>
                        <Col md="3">
                          <label>Availability</label>
                        </Col>
                        <Col md="3">
                          {getReadableDate(product.TimeDuration.Start)}
                        </Col>
                        <Col md="3">-</Col>
                        <Col md="3">
                          {getReadableDate(product.TimeDuration.End)}
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
                            <RangeDatePicker />
                          </Col>
                          <Col md="3" style={{textAlign: "right" }}>
                            <label>Estimate</label>
                            <br />
                            <span id="rentEstimate" style={{fontSize: "2rem"}}>{product.Price}</span>
                          </Col>
                        </Row>
                        <Button theme="accent">Place Order</Button>
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
                        <a href={"/user/" + seller.id} className="text-fiord-blue">
                          <div
                            className="card-post__image"
                            style={{ backgroundImage: `url('${seller.avatar}')`, height: "20px !important", maxWidth: "140px !important" }}
                          >
                          </div>
                        </a>
                        <CardBody>
                          <span className="text-muted">Seller</span>
                          <h5 className="card-title">
                            <a className="text-fiord-blue" href={"/user/" + seller.id}>
                              {seller.Name}

                              <br />
                              <span className="text-muted"><RoomIcon />: {seller.Address}</span>
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
