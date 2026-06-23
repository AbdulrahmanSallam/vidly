import http from "./httpService";

const apiEndpoint = "/customers";

export function getCustomers() {
  return http.get(apiEndpoint);
}
export function getCustomer(id) {
  return http.get(customerUrl(id));
}

export function saveCustomer(customer) {
  if (customer._id) {
    const body = { ...customer };
    delete body._id;
    return http.put(customerUrl(customer._id), body);
  }

  return http.post(apiEndpoint, customer);
}

export function deleteCustomer(id) {
  return http.delete(customerUrl(id));
}

function customerUrl(id) {
  return `${apiEndpoint}/${id}`;
}
