import React, { useEffect, useState, ChangeEvent } from "react";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import styles from "@/styles/edit-customer.module.scss";

enum Channel {
  Website = "website",
  Email = "email",
  Phone = "phone",
  WordOfMouth = "word-of-mouth",
  Other = "other",
  Unknown = "unknown",
}

interface Customer {
  id: number;
  name: string;
  email: string;
  channel: Channel;
  address: string;
  postal: string;
  city: string;
  province: string;
}

const defaultFormErrorState = { name: false, email: false };

export default function EditCustomer() {
  const [customersArray, setCustomersArray] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [editedSelectedCustomer, setEditedSelectedCustomer] =
    useState<Customer>();
  const [errorLoadingMessage, setErrorLoadingMessage] = useState<string>("");
  const [formErrors, setFormErrors] = useState(defaultFormErrorState);

  /** Load customer data from API */
  useEffect(() => {
    fetch(
      "https://waveaccounting.github.io/se-challenge-fe-customers/settings.json"
    )
      .then((response) => response.json())
      .then((data) => {
        setCustomersArray(data.customers);
      })
      .catch((error) => {
        console.error(error);
        setErrorLoadingMessage(
          "There was an issue loading customer data: " + error
        );
      });
  }, []);

  /** Handles changes to customer selection */
  const handleCustomerChange = (event: SelectChangeEvent<number>) => {
    const newSelectedCustomer = customersArray.find(
      (customer) => customer.id === event.target.value
    );
    if (newSelectedCustomer) {
      setSelectedCustomer(newSelectedCustomer);

      // editedSelectedCustomer will hold the updated values before submitting
      setEditedSelectedCustomer(newSelectedCustomer);

      // Reset form errors
      setFormErrors(defaultFormErrorState);
    }
  };

  /** Handles changes to selected customer's properties */
  const handleEditCustomerProperty =
    (property: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setEditedSelectedCustomer((prev) => {
        if (prev) {
          return {
            ...prev,
            [property]: event.target.value,
          };
        }
      });
    };

  /** Handles changes to selected customer's channel property */
  const handleChannelChange = (event: SelectChangeEvent<Channel>) => {
    // Type assertion is fine as we're sure the value is a valid Channel
    const channelValue = event.target.value as Channel;
    setEditedSelectedCustomer((prev) => {
      if (prev) {
        return {
          ...prev,
          channel: channelValue,
        };
      }
    });
  };

  /** Handles updated customer form submission */
  const handleSubmitCustomerUpdate = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Necessary to check updated values immediately
    let updatedFormErrors = { ...formErrors };

    if (editedSelectedCustomer) {
      // Only validation is to check if name or email are empty
      updatedFormErrors = {
        ...updatedFormErrors,
        name: !editedSelectedCustomer.name,
        email: !editedSelectedCustomer.email,
      };

      setFormErrors(updatedFormErrors);
    } else {
      // Shouldn't be possible
      return;
    }

    // At least one field has an error
    if (Object.values(updatedFormErrors).some((error) => error === true)) {
      return;
    }

    // Update customersArray with updated customer
    setCustomersArray((prevArray) =>
      prevArray.map((customer) => {
        return customer.id === editedSelectedCustomer.id
          ? editedSelectedCustomer
          : customer;
      })
    );

    setSelectedCustomer(editedSelectedCustomer);
    const payload = editedSelectedCustomer;

    // Then PUT/PATCH payload to the server API responsible for updating a customer based on unique ID
    // ie. https://server/api/customers/${customerId}
    alert("Customer updated!");
    console.log(payload);
  };

  return (
    <div className={styles["edit-customer-page"]}>
      <main className={styles["content"]}>
        <h1 className={styles["edit-customer-header"]}>Edit customer</h1>
        {errorLoadingMessage && (
          <p className={styles["error-loading-message"]}>
            {errorLoadingMessage}
          </p>
        )}
        <div className={styles["customer-select-field"]}>
          <InputLabel
            id="customer-select-label"
            className={styles["customer-select-label"]}
          >
            Select a customer to edit:
          </InputLabel>
          <Select
            labelId="customer-select-label"
            variant="filled"
            className={styles["customer-select"]}
            value={selectedCustomer?.id ?? ""}
            onChange={handleCustomerChange}
            displayEmpty
          >
            {customersArray.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.id + " (" + customer.email + ")"}
              </MenuItem>
            ))}
          </Select>
        </div>
        {editedSelectedCustomer && (
          <form
            className={styles["edit-customer-form"]}
            onSubmit={handleSubmitCustomerUpdate}
          >
            <p className={styles["form-description"]}>
              {"You may edit the customer's details below:"}
            </p>
            <TextField
              type="text"
              label="Name*"
              color="primary"
              className={styles["name-input"]}
              //required <- commented to manually check instead
              error={formErrors.name}
              helperText={formErrors.name && "Name is required"}
              value={editedSelectedCustomer.name}
              onChange={handleEditCustomerProperty("name")}
            />
            <TextField
              type="text"
              label="Email*"
              color="primary"
              //required <- commented to manually check instead
              error={formErrors.email}
              helperText={formErrors.email && "Email is required"}
              className={styles["email-input"]}
              value={editedSelectedCustomer.email}
              onChange={handleEditCustomerProperty("email")}
            />
            <FormControl className={styles["channel-input"]}>
              <InputLabel id="channel-select-label">Channel</InputLabel>
              <Select
                labelId="channel-select-label"
                id="channel-select"
                value={editedSelectedCustomer.channel}
                label="Channel"
                onChange={handleChannelChange}
              >
                {Object.values(Channel).map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="text"
              label="Address"
              color="primary"
              className={styles["address-input"]}
              value={editedSelectedCustomer.address}
              onChange={handleEditCustomerProperty("address")}
            />
            <TextField
              type="text"
              label="City"
              color="primary"
              className={styles["city-input"]}
              value={editedSelectedCustomer.city}
              onChange={handleEditCustomerProperty("city")}
            />
            <TextField
              type="text"
              label="Province"
              color="primary"
              className={styles["province-input"]}
              value={editedSelectedCustomer.province}
              onChange={handleEditCustomerProperty("province")}
            />
            <TextField
              type="text"
              label="Postal"
              color="primary"
              className={styles["postal-input"]}
              value={editedSelectedCustomer.postal}
              onChange={handleEditCustomerProperty("postal")}
            />
            <Button
              variant="contained"
              type="submit"
              className={styles["submit-button"]}
            >
              Update customer
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
