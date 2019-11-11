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
  FormCheckbox,
  FormSelect,
  FormTextarea,
  Button,
  CardBody
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import Editor from "../components/add-new-post/Editor";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";
import RangeDatePicker from "../components/common/RangeDatePicker";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getReadableDate(isoDate) {
  var date = new Date(isoDate);
  return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();//prints expected format.
};

class AddProductPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      product: []
    };
  }

  render() {
    const {
      product,
    } = this.state;

    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle title="Add New Product" subtitle="Product Details" md="12" className="ml-sm-auto mr-sm-auto" />
        </Row>
        <Row>
          <Col lg="1"></Col>
          <Col lg="10">
            <Card large>
              <CardBody>
                {/* Description and availability */}
                <Row>
                  <Col>
                    <Form>
                      <Row>
                        <Col md="4">
                          <div className="custom-file mb-3" style={{float:"left"}}>
                            <input type="file" className="custom-file-input" id="photoFile" />
                            <label className="custom-file-label" htmlFor="photoFile">Choose file...</label>
                          </div>
                        </Col>
                        <Col md="2">
                        <Button type="submit" style={{ float: "left" }}>Upload !</Button>
                        </Col>
                        <Col md="3">
                          <Button type="submit" style={{ float: "right" }}>Create !</Button>
                        </Col>
                      </Row>
                      <br />
                      <br />
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="feName">Name</label>
                          <FormInput
                            id="feName"
                            placeholder="Name of product"
                          />
                        </Col>
                        <Col md="6">
                          <label htmlFor="feTags">Tags</label>
                          <FormInput
                            id="feTags"
                            placeholder="Enter comma separated tags for your product"
                          />
                        </Col>
                      </Row>

                      <FormGroup>
                        <label htmlFor="feDescription">Description</label>
                        <FormTextarea id="feDescription"
                          rows="5" placeholder="Enter size, condition, other details here" />
                      </FormGroup>

                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="feAvailability">Availability</label>
                          <RangeDatePicker />
                        </Col>
                        <Col md="6">
                          <label htmlFor="fePrice">Price</label>
                          <FormInput
                            id="fePrice"
                            placeholder="¥ 99.9"
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
