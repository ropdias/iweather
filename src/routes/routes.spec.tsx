import { act, screen } from '@testing-library/react-native'
import { Routes } from '@routes/index'
import { saveStorageCity } from '@libs/asyncStorage/cityStorage'
import { render } from '@__tests__/utils/customRender'
import { mockWeatherAPIResponse } from '@__tests__/mocks/api/mockWeatherAPIResponse'
import { api } from '@services/api'

describe('Routes', () => {
  it('should be render Search screen when not city selecte', async () => {
    render(<Routes />)

    const title = await screen.findByText(/^escolha um local/i)

    expect(title).toBeTruthy()
  })
  it('shoul be render Dashboard screen when has city selected', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ data: mockWeatherAPIResponse })

    const city = {
      id: '1',
      name: 'São Paulo',
      latitude: 123,
      longitude: 456,
    }

    await saveStorageCity(city)

    render(<Routes />)

    const title = await screen.findByText(city.name)

    expect(title).toBeTruthy()
  })
})
