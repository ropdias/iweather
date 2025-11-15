import { mockWeatherAPIResponse } from '@__tests__/mocks/api/mockWeatherAPIResponse'
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@__tests__/utils/customRender'
import { api } from '@services/api'
import { Dashboard } from '@screens/Dashboard'
import { saveStorageCity } from '@libs/asyncStorage/cityStorage'
import { mockCityAPIResponse } from '@__tests__/mocks/api/mockCityAPIResponse'

describe('Screen: Dashboard', () => {
  beforeAll(async () => {
    const city = {
      id: '1',
      name: 'Rio do Sul, BR',
      latitude: 123,
      longitude: 456,
    }

    await saveStorageCity(city)
  })

  it('should be show city weather', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ data: mockWeatherAPIResponse })

    render(<Dashboard />)

    const cityName = await screen.findByText(/rio do sul/i)
    expect(cityName).toBeTruthy()
  }, 10000)

  it('should be show another selected weather city', async () => {
    /* 
        1- Mock the API response for the initial city weather data.
        2- Save the initial city to storage.
        3- Mock the API responses for the new city selection.
        4- Render the Dashboard component.
        5- Verify that the new city's weather information is displayed correctly.
    */

    jest
      .spyOn(api, 'get')
      .mockResolvedValueOnce({ data: mockWeatherAPIResponse })
      .mockResolvedValueOnce({ data: mockCityAPIResponse })
      .mockResolvedValueOnce({ data: mockWeatherAPIResponse })

    render(<Dashboard />)

    await waitForElementToBeRemoved(() => screen.queryByTestId('loading'))

    const cityName = 'São Paulo'

    const search = await screen.findByTestId('search-input')
    fireEvent.changeText(search, cityName)

    const option = await screen.findByText(cityName, { exact: false })
    expect(option).toBeTruthy()

    fireEvent.press(option)
  })
})
