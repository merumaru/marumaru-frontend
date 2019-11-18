import React from "react";
import {
  Container, Row, Col, Card,
  Form,
  FormGroup,
  FormInput,
  FormTextarea,
  Button,
  CardBody,
  Alert
} from "shards-react";
import axios from "axios";
import PageTitle from "../components/common/PageTitle";
import RangeDatePicker from "../components/common/RangeDatePicker";
import { API_URL } from "../config";

function isPositiveFloat(s) {
  return !isNaN(s) && Number(s) > 0;
}

class AddProductPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      photo: "",
      tags: "",
      description: "",
      price: "",
      startdate: undefined,
      enddate: undefined,
      alertmsg: ""
    }
    this.datepicker = undefined;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    console.log('dates', this.datepicker.state);
    const today = new Date(); today.setHours(0, 0, 0, 0);

    // validation checks
    if (this.state.name === "" || this.state.photo === "" ||
      this.state.price === "") {
      this.setState({ alertmsg: "Need to fill required inputs!" });
    }
    // date checks
    else if (this.datepicker === undefined ||
      this.datepicker.state.startDate === undefined ||
      this.datepicker.state.endDate === undefined) {
      this.setState({ alertmsg: "Choose valid dates !"});
    }
    else if(this.datepicker.state.startDate  > this.datepicker.state.endDate) {
      this.setState({ alertmsg: "Start date must be before end date!"});
    }
    else if(this.datepicker.state.startDate < today ||
      this.datepicker.state.endDate < today) {
      this.setState({ alertmsg: "Dates cannot be before today!"});
    }
    // price check
    else if(!isPositiveFloat(this.state.price)) {
      this.setState({ alertmsg: "Price needs to be a positive number!"});
    }

    else{
      console.log('Attempting to make product');
      var timeduration = {Start: this.datepicker.state.startDate, End: this.datepicker.state.endDate};

      axios(API_URL + '/products', {
        method: "post",
        withCredentials: true,
        data: {
          name: this.state.name,
          photos: [this.state.photo],
          tags: this.state.tags.split(","),
          description: this.state.description,
          timeduration: timeduration,
          price: Number(this.state.price)
      }})
        .then((response) => {
          if (response.data != null) {
            console.log(response.data);
            this.setState({ alertmsg: response.data.message + ' Redirecting in a while ...' });
            setTimeout(() => {
              this.props.history.push("/products/" + response.data.info)
            }, 2500);
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
              this.setState({ alertmsg: "Error happened in adding product : " + error.response.data.message});
            }
          }
        });
    }
  }

  onChange(item) {
    this.setState({ [item.target.name]: item.target.value });
    // console.log( item.target.name, 'is', this.state[item.target.name]);
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4">
        {this.state.alertmsg && <Alert className="mb-0" id="alertmsg">{this.state.alertmsg}</Alert>}

        <Row noGutters className="page-header py-4">
          <PageTitle title="Add New Product" subtitle="Product Details" md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row>
          <Col lg="1"></Col>
          <Col lg="10">
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <Form>
                      <Row>
                        <Col md="6" className="form-group">
                          <label htmlFor="name">Name * (required)</label>
                          <FormInput
                            required
                            id="name" name="name"
                            onChange={this.onChange}
                            placeholder="Name of product"
                          />
                        </Col>
                        <Col md="3">
                          <Button type="submit"
                            onClick={this.handleSubmit}
                            style={{ float: "right" }}>Create !</Button>
                        </Col>
                      </Row>
                      <br />
                      <br />
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="feUrl">File URL * (required)</label>
                          <FormInput
                            required
                            id="photo" name="photo"
                            onChange={this.onChange}
                            placeholder="http://link.net"
                          />

                        </Col>
                        <Col md="6">
                          <label htmlFor="tags">Tags</label>
                          <FormInput
                            id="tags" name="tags"
                            onChange={this.onChange}
                            placeholder="Enter comma separated tags for your product"
                          />
                        </Col>
                      </Row>

                      <FormGroup>
                        <label htmlFor="feDescription">Description</label>
                        <FormTextarea id="description" name="description"
                          onChange={this.onChange}
                          rows="5" placeholder="Enter size, condition, other details here" />
                      </FormGroup>

                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="feAvailability">Availability</label>
                          <RangeDatePicker ref={(ref) => this.datepicker = ref} />
                        </Col>
                        <Col md="6">
                          <label htmlFor="price">Price per day * (required)</label>
                          <FormInput
                            id="price" name="price"
                            required
                            onChange={this.onChange}
                            placeholder="99.9"
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default AddProductPage;
