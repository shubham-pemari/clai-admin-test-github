import React from 'react'
import { 
  Button,
  Form,
  Modal,
  Icon 
} from 'semantic-ui-react'

const customData = {
  clarity: {
    // baseUrl: "",
    // createdAt: Date.now(),
    // serverRoot : "",
    // userId: null,
    // firstName: "",
    // fullName: "",
    // lang: "",
    // lastName: "",
    // locale: "en_GB",
    // userName: "",
    // version: "",
    authToken: "",
    url: "",
    // resourceId: null,
    // page: ""
  }
}

function PopupWindow() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')
  const [dissable, setDissable] = React.useState(true)

  handleCustomData = () => {
    let data = (localStorage.getItem('UserContext') != null) ? JSON.parse(localStorage.getItem('UserContext')) : customData;
    // data.clarity.fullName = data.clarity.firstName + " " + data.clarity.lastName;
    setValue(JSON.stringify(data, null, 4));
    localStorage.setItem('UserContext', JSON.stringify(data));
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    IsJsonString(e.target.value) ? setDissable(false) : setDissable(true)
    // console.log(IsJsonString(value))
  }

  function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  // const handleChangeInputFields = (e) => {
  //   console.log(value)
  //   // IsJsonString(value) ? setDissable(false) : setDissable(true)
  // }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={(        
        <Icon
          name='globe'
          color='grey'
          onClick={this.handleCustomData}
        />
      )}
    >
      <Modal.Header>Set Custom Data</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            {/* <Form.Group widths='equal'>
              <Form.Input name="authToken" onChange={handleChangeInputFields} value={JSON.stringify(customData)} fluid label='Auth Token' placeholder='Auth Token' />
              <Form.Input name="url" onChange={handleChangeInputFields} value={JSON.stringify(customData)} fluid label='Url' placeholder='Url' />
            </Form.Group> */}
            <Form.TextArea value={value} style={{ minHeight: 470 }} onChange={handleChange} label='Custom Data' placeholder='Response...' />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Close
        </Button>
        <Button
          disabled={dissable}
          content="Save"
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            setOpen(false);
            try {
              IsJsonString(value) ? [localStorage.setItem('UserContext', value), setDissable(true)] : null
              // customData = value
            } catch(err) {
              console.log(err.message)
            }
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default PopupWindow