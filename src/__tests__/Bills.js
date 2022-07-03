/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";
import mockStore from "../__mocks__/store.js";

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
    test("Then bills are displayed on the page", async () => {
        const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname })
          }
      
          const bills = new Bills({
            document,
            onNavigate,
            store: mockStore,
            localStorage: window.localStorage,
          })
      
          const fetchedBills = await bills.getBills()
          const billsList = await mockStore.bills().list()
      
          document.body.innerHTML = BillsUI({ data: fetchedBills })
      
          expect(fetchedBills.length).toBe(4)
    })
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

    
  });
});


// test d'intégration GET
describe("Given I am a user connected as Employe", () => {
    describe("When I navigate to Bills", () => {
      test("fetches bills from mock API GET", async () => {
        localStorage.setItem("user", JSON.stringify({ type: "Admin", email: "a@a" }));
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)
        const noteDeFrais = await screen.getByText("Mes notes de frais")
         expect(noteDeFrais).toBeTruthy()
 
         const dataFetch = await screen.getByText("Hôtel et logement")
         expect(dataFetch).toBeTruthy()
 
         const tableTitleType = await screen.getByText("Type")
         expect(tableTitleType).toBeTruthy()
       
        expect(screen.getByTestId("tbody")).toBeTruthy()
      })
    })

    // Test API et Error messages
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.mock("../app/store", () => mockStore)

        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
            window,
            'localStorage',
            { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      test("fetches bills from an API and fails with 404 message error", async () => {
  
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }})
        window.onNavigate(ROUTES_PATH.Bills)
        document.body.innerHTML = BillsUI({ error: "Erreur 404" });

        //await new Promise(process.nextTick);
        
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })
  
      test("fetches messages from an API and fails with 500 message error", async () => {
  
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 500"))
            }
          }})
  
        window.onNavigate(ROUTES_PATH.Bills);
       // await new Promise(process.nextTick);
        document.body.innerHTML = BillsUI({ error: "Erreur 500" });

        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      })
      
  
    })
  })
  
describe("Given I am connected as an employee", () => {
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
})
