/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { formatDate } from "../app/format.js";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";
import NewBillUI from "../views/NewBillUI.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    /**
     * Window icon on vertical layout is highlighted
     */
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    });
    /**
     *
     * Bills are sorted
     *
     */
    test("Then bills should be ordered from earliest to latest", () => {
       // const bills =(new Bills()).getBills()
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen.getAllByLabelText("Date").map((a) => a.innerHTML);
      // const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const arrayMockedSorted = [
        "2004-04-04",
        "2003-03-03",
        "2002-02-02",
        "2001-01-01",
      ];
      const antiChrono = (a, b) => (new Date(a) < new Date(b) ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);

      expect(datesSorted).toEqual(arrayMockedSorted);
    });
    /**
     * Loading...
     */

    test("I am on Bills  page but it is loading, Loading page should be rendered", () => {
      document.body.innerHTML = BillsUI({ loading: true });
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });

    /**
     * Open Modal on click
     */

    test("When I click on eye-icon, modal opens", () => {
      // Que la construction HTML
      document.body.innerHTML = BillsUI({ data: bills });

      // mock store
      const store = null;
    // comportement

   const billsList = new Bills({
         document,
         onNavigate,
         store,
         localStorage: window.localStorage,
       });

      //mock modal
      $.fn.modal = jest.fn();
      const eye = screen.getAllByTestId("icon-eye")[0];
      const handleClickIconEye = jest.fn(() =>
        billsList.handleClickIconEye(eye)
      );

      eye.addEventListener("click", handleClickIconEye);
      fireEvent.click(eye);
      expect(handleClickIconEye).toHaveBeenCalled();
      
    });

    /**
     * Open "nouvelle note de frais"
     * 
     */
     test("When I click on Nouvelle note de frais button, go to NewBill", () => {
       // DOM elements

       const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ pathname });
       };

       const store = null

       const billsMock = new Bills({
         document,
         onNavigate,
         store,
         localStorage: window.localStorage,
       });

       document.body.innerHTML = BillsUI({ data: bills });
       //   //mock handleClickNewBillMock
       const buttonNewBill = screen.getByTestId("btn-new-bill");

       const handleClickNewBill = jest.fn((e) =>
         billsMock.handleClickNewBill(e)
       );

       buttonNewBill.addEventListener("click", handleClickNewBill);
       fireEvent.click(buttonNewBill);
       expect(handleClickNewBill).toHaveBeenCalled();
       const noteDeFrais = screen.getByText("Envoyer une note de frais");
       expect(noteDeFrais).toBeTruthy();
     });
  });
});
