/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { formatDate } from "../app/format.js";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";

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
      // DOM elements
      document.body.innerHTML = BillsUI({ data: bills });
      //mock modal
      $.fn.modal = jest.fn();
      // mock store
      const mockStore = null;

      const eye = screen.getAllByTestId("icon-eye")[0];
      const bills = new Bills({
        document,
        onNavigate,
        mockStore,
        localStorage: window.localStorage,
      });

      const handleClickIconEye = jest.fn(() => bills.handleClickIconEye(eye));
      eye.addEventListener("click", handleClickIconEye);
      fireEvent.click(eye);
      const modale = document.getElementById('modaleFile')

      expect(handleClickIconEye).toHaveBeenCalled();
     expect(modale.classList.contains("show")).toBeTruthy()

      expect(modale).toBeTruthy();
    });

    /**
     * Open "nouvelle note de frais"
     * 
     */
    // test("When I click on Nouvelle note de frais button, go to NewBill", () => {
    //   // DOM elements
    //   document.body.innerHTML = BillsUI({ data: bills });
      
    //   const billss = new Bills({
    //     document,
    //     onNavigate,
    //     store: null,
    //     localStorage: window.localStorage,
    //   });
    //   const newBillBtn = screen.getByTestId("btn-new-bill");
    //   //mock handleClickNewBillMock
    //   const handleClickNewBillMock = jest.fn(billss.handleClickNewBill)
    //   newBillBtn.addEventListener('click', handleClickNewBillMock)
    //   fireEvent.click(newBillBtn)
    //   expect(handleClickNewBillMock).toHaveBeenCalled();
    //   const noteDeFrais = screen.getAllByText("Envoyer une note de frais")
    //   expect(noteDeFrais).toBeTruthy()

    
    // });
  });
});
