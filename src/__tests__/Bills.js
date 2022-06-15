/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import { formatDate } from "../app/format.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    /**
     * Premier test
     */
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression

    })
    /**
     * 
     * Deuxieme test, pour l'ordre décroissant
     * 
     */
    test("Then bills should be ordered from earliest to latest", () => {
  
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByLabelText('Date').map(a => a.innerHTML)
     // const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const arrayMockedSorted = [
        "2004-04-04",
        "2003-03-03",
        "2002-02-02",
        "2001-01-01", 
      ]
     const antiChrono = (a, b) => ((new Date(a) < new Date(b)) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      
      expect(datesSorted).toEqual(arrayMockedSorted)
    })
  })
})
