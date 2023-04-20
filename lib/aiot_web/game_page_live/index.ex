defmodule AiotWeb.GamePageLive.Index do
  require Logger
  use AiotWeb, :live_view
  use Phoenix.HTML
  import Phoenix.LiveView
  alias Phoenix.LiveView.Socket
  # alias Phoenix.LiveView.JS

  @type state :: :top | :menu | :in_game | :show_result

  @doc """
  %%{init: {"flowchart": {"curve" :"cardinal"}}}%%
  graph TD
    top[:top]
    menu[:menu]
    game[:in_game]
    result[:show_result]

    top --> |"click start btn"| menu
    menu --> |"click game start btn"| game
    game --> |"client-side game ended"| result
    result --> |"click end btn"| menu
    result --> |"click restart btn"| game
  """

  @impl true
  def mount(_params, _session, socket) do
    Logger.put_module_level(Logger, :all)

    socket =
      socket
      |> assign(state: :top)

    {:ok, socket}
  end

  @impl true
  def handle_params(_params, _url, socket) do
    {:noreply, socket}
  end

  @impl true
  def handle_event("open_menu_from_top" = ev, params, socket) do
    Logger.info(%{event: ev, params: params})

    if get_assigned(socket, :state) != :top do
      {:noreply, socket}
    else
      socket =
        socket
        |> assign(state: :menu)

      {:noreply, socket}
    end
  end

  @impl true
  def handle_event("start_game" = ev, params, socket) do
    Logger.info(%{event: ev, params: params})

    socket =
      socket
      |> assign(state: :in_game)
      |> push_event("startGame", %{})

    {:noreply, socket}
  end

  @impl true
  def handle_event("end_game" = ev, params, socket) do
    Logger.info(%{event: ev, params: params})

    socket =
      socket
      |> assign(state: :show_result)

    # Add game result data to assigns

    {:reply, %{:c => "d", "e" => %{f: 1, g: "h"}}, socket}
  end

  @impl true
  def handle_event("back_to_menu_from_result" = ev, params, socket) do
    Logger.info(%{event: ev, params: params})

    if not state_is?(socket, :show_result) do
      {:noreply, socket}
    else
      socket =
        socket
        |> assign(state: :menu)

      {:noreply, socket}
    end
  end

  @impl true
  def handle_event("restart_game_from_result" = ev, params, socket) do
    Logger.info(%{event: ev, params: params})

    if not state_is?(socket, :show_result) do
      {:noreply, socket}
    else
      socket =
        socket
        |> assign(state: :in_game)
        |> push_event("startGame", %{})

      {:noreply, socket}
    end
  end

  @impl true
  def handle_event(event, params, socket) do
    Logger.info("undefined event was pushed")
    Logger.info(%{event: event, params: params, assigns: socket.assigns})

    {:noreply, socket}
  end

  defp get_assigned(socket = %Socket{}, key, default \\ nil) do
    Map.get(socket.assigns, key, default)
  end

  defp state_is?(socket = %Socket{}, state) do
    get_assigned(socket, :state) == state
  end
end
