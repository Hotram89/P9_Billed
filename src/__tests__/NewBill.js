/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I give a good format for proof file", () => {

        const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname });
          };
      const html = NewBillUI()
      document.body.innerHTML = html
     
      const mockStore = null
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      const img = new File(['img'], 'image.jpeg', {type:'image/jpeg'});
      await waitFor(() => { userEvent.upload(inputFile, img) })
      fireEvent.change(input,{target:{file:"test.jpg"}})
      fireEvent.upload()


    })
  })
})
