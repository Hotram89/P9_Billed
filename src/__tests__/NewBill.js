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

      fireEvent.change(inputFileButton, {
        target: {
          files: [file],
        },
      });

      expect(handleChangeFileMock).toHaveBeenCalled();
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
        const errorMessage = screen.getByTestId("error")
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
        expect(errorMessage.contains("activ")).toBe(true); 

      });
  })
})

// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
    describe("When I navigate to NewBills", () => {
      test("fetches bills from mock API POST", async () => {
        localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.NewBill)

        
        const form = screen.getByTestId("from-new-bill")

        fireEvent.submit(form)
        const contentPending  = await screen.getByText("En attente (1)")
        expect(contentPending).toBeTruthy()
        const contentRefused  = await screen.getByText("Refusé (2)")
        expect(contentRefused).toBeTruthy()
        expect(screen.getByTestId("big-billed-icon")).toBeTruthy()
      })
      
    describe("When an error occurs on API", () => {
      beforeEach(() => {
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
        window.onNavigate(ROUTES_PATH.Dashboard)
        await new Promise(process.nextTick);
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
  
        window.onNavigate(ROUTES_PATH.Dashboard)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  
    })
  })
  