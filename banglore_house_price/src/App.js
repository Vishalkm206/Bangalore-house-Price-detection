import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./App.css";



function App() {
  fetch("http://127.0.0.1:5000/get_location_names")
  .then(response => response.json())
  .then(data => {
    const uiLocations = document.getElementById("uiLocations"); // Assuming you have this element defined somewhere

    for (let i in data["locations"]) {
      const option = document.createElement("option");
      option.value = data["locations"][i]; // Use the actual value from the API response
      option.textContent = data["locations"][i];
      uiLocations.appendChild(option);
    }
  })
  .catch(error => {
    console.error("Error:", error);
  });


  const getBathValue = () => {
    const uiBathrooms = document.getElementsByName("uiBathrooms");
    for (var i in uiBathrooms) {
      if (uiBathrooms[i].selected) {
        return parseInt(i) + 1;
      }
    }
    return -1; // Invalid Value
  }
  
  const getBHKValue = () => {
    const uiBHK = document.getElementsByName("uiBHK");
    for (var i in uiBHK) {
      if (uiBHK[i].selected) {
        return parseInt(i) + 1;
      }
    }
    return -1; // Invalid Value
  }

  const generatePrice = () => {
    const sqft = document.getElementById("uiSqft");
    const bhk = getBHKValue();
    const bathrooms = getBathValue();
    const location = document.getElementById("uiLocations");
    const estPrice = document.getElementById("uiEstimatedPrice");
  
    const formData = new URLSearchParams();
    formData.append('total_sqft', parseFloat(sqft.value));
    formData.append('bhk', bhk);
    formData.append('bath', bathrooms);
    formData.append('location', location.value);
  
    fetch("http://127.0.0.1:5000/predict_home_price", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        estPrice.innerHTML =
          "<h2>Est. Price - " + data.estimate_price.toString() + " Lakh</h2>";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  

  return (
    <div className='background'>
    <div className='container glass'>
      <Form>

        <Form.Label>Area (Sq.ft)</Form.Label>
        <Form.Control
          required
          type="number"
          placeholder="Insert Area"
          defaultValue="1000"
          id="uiSqft"
        />


        <Form.Label>BHK</Form.Label>
        <Form.Select aria-label="Default select example">
          <option value="1" id="radio-bhk-1" name="uiBHK">1</option>
          <option value="2" id="radio-bhk-2" name="uiBHK">2</option>
          <option value="3" id="radio-bhk-3" name="uiBHK">3</option>
          <option value="4" id="radio-bhk-4" name="uiBHK">4</option>
          <option value="5" id="radio-bhk-5" name="uiBHK">5</option>
        </Form.Select>

        <Form.Label>Bathrooms</Form.Label>
        <Form.Select aria-label="Default select example">
          <option value="1" id="radio-bath-1" name="uiBathrooms">1</option>
          <option value="2" id="radio-bath-2" name="uiBathrooms">2</option>
          <option value="3" id="radio-bath-3" name="uiBathrooms">3</option>
          <option value="4" id="radio-bath-4" name="uiBathrooms">4</option>
          <option value="5" id="radio-bath-5" name="uiBathrooms">5</option>
        </Form.Select>

        <Form.Label>Location</Form.Label>
        <Form.Select aria-label="Default select example" id="uiLocations">
          <option value="" disabled="disabled" selected="selected">Choose a Location</option>
          <option>Electronic City</option>
          <option>Rajaji Nagar</option>
        </Form.Select>
      </Form>
      <Button className="submit" onClick={generatePrice} variant="outline-success">Estimate Price</Button>
      <br />
      <div id="uiEstimatedPrice" className="result">	<h2></h2> </div>
          </div>
    </div>
  );
}

export default App;
