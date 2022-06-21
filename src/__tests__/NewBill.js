/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import store from "../__mocks__/store";


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
        
        
    })

    test("The input for proof file change", () => {
    
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

      fireEvent.change(inputFileButton, {
        target: {
          files: [file],
        },
      });

      expect(handleChangeFileMock).toHaveBeenCalled();
    });
  })
})
