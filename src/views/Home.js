/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Badge,
  Alert
} from "shards-react";
import axios from "axios";
import { API_URL } from "../config";

import PageTitle from "../components/common/PageTitle";

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Product List
      PostsList: [
      ],

      // Seller list
      SellerList: [],

    };
  }

  getAllProducts() {
    axios.get(API_URL + '/products', { withCredentials: true })
      .then((response) => {
        if (response.data != null) {
          console.log('Populating products', response.data);
          this.setState({ PostsList: response.data });  
        }
      })
      .catch((error) => {
        console.log("Error in doing get request" + error.response);
        if(error.response !== undefined) {
          if(error.response.status == 401) {
            console.log("Error in doing get request" + error.response.data.message);
            this.setState({ alertmsg: "User is not logged in."});
            setTimeout(function () {
              window.location = "/login";
            }, 500);
          } else {
            this.setState({ alertmsg: "Error happened in fetching products : " + error.response.data.message});
          }
        }
      });
  }

  componentDidMount() {
    this.getAllProducts();
  }

  render() {
    const {
      PostsList,
      SellerList
    } = this.state;

    return (
      <Container fluid className="main-content-container px-4">
        {this.state.alertmsg && <Alert className="mb-0" id="alertmsg">{this.state.alertmsg}</Alert>}

        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Products you might be interested in" subtitle="Home" className="text-sm-left" />
        </Row>
        <a href="/add-product">List your own product!</a>
        <div style={{margin: "50px"}}></div>
        {/* Row of Posts */}
        <Row>
          {PostsList.map((post, idx) => (
            <Col lg="3" md="6" sm="12" className="mb-4" key={idx}>

              <Card small className="card-post card-post--1">
                <a href={"/products/" + post.ID} className="text-fiord-blue">
                  <div
                    className="card-post__image"
                    style={{ backgroundImage: `url(${post.photos[0]})`, maxHeight: "600px", maxWidth: "400px" }}
                  >
                    <div style={{ float: "right", width: "50px" }}>
                      {post.tags.map((item) => <Badge
                        pill
                        className={`card-post__category`} style={{ marginTop: "5px", float: "right" }}
                      >{item}</Badge>)}
                    </div>

                    <div className="card-post__author d-flex">
                      <a href={"/users/" + post.userID}
                        className="card-post__author-avatar card-post__author-avatar--small"
                      >
                      </a>
                    </div>
                  </div>
                </a>
                <CardBody>
                  <h5 className="card-title">
                    <a href={"/products/" + post.ID} className="text-fiord-blue">
                      {post.name}
                    </a>
                    <span className="text-muted" style={{ float: "right" }}>¥ {post.price}</span>
                  </h5>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Row of Seller Profiles */}
        <Row>
          {SellerList.map((post, idx) => (
            <Col lg="6" sm="12" className="mb-4" key={idx}>
              <Card small className="card-post card-post--aside card-post--1">
                <div
                  className="card-post__image"
                  style={{ backgroundImage: `url('${post.backgroundImage}')` }}
                >
                  <Badge
                    pill
                    className={`card-post__category`}
                  >
                    {post.tags}
                  </Badge>
                  <div className="card-post__author d-flex">
                    <a
                      href="#"
                      className="card-post__author-avatar card-post__author-avatar--small"
                      style={{ backgroundImage: `url('${post.Avatar}')` }}
                    >
                    </a>
                  </div>
                </div>
                <CardBody>
                  <h5 className="card-title">
                    <a className="text-fiord-blue" href="#">
                      {post.Name}
                    </a>
                  </h5>
                  <p className="card-text d-inline-block mb-3">{post.body}</p>
                  <span className="text-muted">{post.tim}</span>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

      </Container>
    );
  }
}

export default HomePage;
