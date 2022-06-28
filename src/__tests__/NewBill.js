/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import BillsUI from "../views/BillsUI.js";

import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import store from "../__mocks__/store";
import mockStore from "../__mocks__/store.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Envelope icon in vertical layout should be highlighted", async () => {
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
      window.onNavigate(ROUTES_PATH.NewBill);
      await waitFor(() => screen.getByTestId("icon-mail"));
      const windowIcon = screen.getByTestId("icon-mail");

      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    });

    test("The input for proof file change with a correct image", () => {
      //charge le html d'une page NewBill
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      //   //propose ces comportements pour la construction de la page
      const newBill = new NewBill({
        document,
        onNavigate,
        store: store,
        localStorage: window.localStorage,
      });
      //mock la fonction appelée
      const handleChangeFileMock = jest.fn(newBill.handleChangeFile);

      //recupere l'input du fichier a ajouter
      const inputFileButton = screen.getByTestId("file");
      inputFileButton.addEventListener("change", handleChangeFileMock);

      //   mock un fichier
      const file = new File(["myProof.jpg"], "myProof.jpg", {
        type: "image/jpg",
      });
      const errorMessage = screen.getByTestId("error");


      fireEvent.change(inputFileButton, {
        target: {
          files: [file],
        },
      });

      expect(handleChangeFileMock).toHaveBeenCalled();
      expect(errorMessage.classList.contains("activ")).toBe(false);
    });

    test("The input for proof file change with a wrong image", () => {
      //charge le html d'une page NewBill
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      //   //propose ces comportements pour la construction de la page
      const newBill = new NewBill({
        document,
        onNavigate,
        store: store,
        localStorage: window.localStorage,
      });
      //mock la fonction appelée
      const handleChangeFileMock = jest.fn(newBill.handleChangeFile);
      //recupere l'input du fichier a ajouter
      const inputFile = screen.getByTestId("file");
      const errorMessage = screen.getByTestId("error");
      inputFile.addEventListener("change", handleChangeFileMock);

      //   mock un fichier
      const file = new File(["myProof.doc"], "myProof.doc", {
        type: "image/jpg",
      });

      fireEvent.change(inputFile, {
        target: {
          files: [file],
        },
      });
      //est ce que que inputFile.value est vide

      expect(handleChangeFileMock).toHaveBeenCalled();
      expect(errorMessage.classList.contains("activ")).toBe(true);
    });
  });
});

// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to NewBills", () => {
    describe("When I submit the form", () => {
        test("a new bill have been added", async () => {
            localStorage.setItem(
              "user",
              JSON.stringify({ type: "Employee", email: "a@a" })
            );
            const root = document.createElement("div");
            root.setAttribute("id", "root");
            document.body.append(root);
      
            const mockedBill = {
              id: "UUIZtnPsldibFnB0ozvJh",
              name: "test5",
              email: "a@a",
              type: "Services en ligne",
              vat: "60",
              pct: 20,
              commentAdmin: "ca ne passe pas",
              amount: 300,
              status: "refused",
              date: "2003-03-03",
              commentary: "",
              fileName:
                "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
              fileUrl:
                "https://test.storage.tld/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3",
            };
            
              
            // const form = screen.getByTestId("form-new-bill")
            const handleSubmit = jest.fn(newBill.handleSubmit)
            const newBillform = screen.getByTestId("form-new-bill")
            newBillform.addEventListener('submit', handleSubmit)
            fireEvent.submit(newBillform)
            expect(handleSubmit).toHaveBeenCalled()
      
            const store = mockStore;
            window.onNavigate(ROUTES_PATH.Bills);
            router();
            const bills = await store.post(mockedBill);
      
            // fireEvent.submit(form)
            expect(bills.data.length).toBe(5);
          });
    })
   

    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.mock("../app/store", () => mockStore);

        jest.spyOn(mockStore, "bills");
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "a@a",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
      });


      test("fetches bills from an API and fails with 404 message error", async () => {
        localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee", email: "a@a" })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.NewBill);
        jest.spyOn(mockStore, "bills");

        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.NewBill);
        document.body.innerHTML = BillsUI({ error: "Erreur 404" });

        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });

      test("fetches messages from an API and fails with 500 message error", async () => {
        localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee", email: "a@a" })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.NewBill);
        jest.spyOn(mockStore, "bills");

        mockStore.bills.mockImplementationOnce(() => {
          return {
            create: (bill) => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        await new Promise(process.nextTick);
        const html = BillsUI({ error: "Erreur 500" });
        document.body.innerHTML = html;
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });

     
    });
  });
});
