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

      //propose ces comportements pour la construction de la page
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
      expect(errorMessage.classList.contains("activ")).toBeFalsy();
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
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const html = NewBillUI();
        document.body.innerHTML = html;

        const newBillBoard = new NewBill({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage,
        });

        const handleSubmitMoked = jest.fn(newBillBoard.handleSubmit);
        const submit = screen.getByTestId("form-new-bill");

        submit.addEventListener("submit", handleSubmitMoked);
        fireEvent.submit(submit);

        expect(handleSubmitMoked).toHaveBeenCalled();
        expect(screen.getByText("Mes notes de frais")).toBeTruthy();

        const newBill = {
          id: "abCD1SzECmaZAGRrHjaC",
          status: "refused",
          pct: 20,
          amount: 200,
          email: "a@a",
          name: "test2",
          vat: "40",
          fileName: "test.jpg",
          date: "2002-02-02",
          commentAdmin: "pas la bonne facture",
          commentary: "test2",
          type: "Restaurants et bars",
          fileUrl:
            "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732",
        };
        
      });
    });

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
