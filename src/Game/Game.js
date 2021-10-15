import React, {useState, useEffect} from "react";
import {fetchServerData} from "../App";


export const Game = () => {
    const [fetchedDataFromServer, setFetchedDataFromServer] = useState([]);

    const getAllData = async () => {
        try {
            const dataFromServer = await fetchServerData();
            setFetchedDataFromServer(dataFromServer);
        } catch (error) {
            console.error('Dear Client, something went wrong: ', error);
        }
    }

    useEffect(() => {
        getAllData()
    }, [])

    const allGameModes = Object.keys(fetchedDataFromServer);
    const [currentGameMode, setCurrentGameMode] = useState('modeIsNotChosen');
    const [gameFieldSize, setGameFieldSize] = useState(5);
    const gameTemplate = Array(gameFieldSize * gameFieldSize).fill().map((element, index) => index + 1);

    const gameModeHandler = (mode) => {
        setGameFieldSize(fetchedDataFromServer[mode].field);
    }

    const [gameStartTrigger, setGameStartTrigger] = useState(false);

    const [hoveredSquares, setHoveredSquares] = useState([]);
    const [squareCoordinates, setSquareCoordinates] = useState([]);

    const hoverCardHandler = squareIndex => {
        setHoveredSquares(square => [...square, squareIndex]);
        setSquareCoordinates(coordinates => {
            return [...coordinates, {
                cardIndex: squareIndex,
                coordinates: [Math.ceil(squareIndex / gameFieldSize), Math.ceil(squareIndex % gameFieldSize) === 0 ? gameFieldSize : Math.ceil(squareIndex % gameFieldSize)]
            }]
        });
        if (hoveredSquares.includes(squareIndex)) {
            setHoveredSquares(openedCard => openedCard.filter(number => number !== squareIndex))
            setSquareCoordinates(card => card.filter(num => num.cardIndex !== squareIndex))
        }
    }

    const nameForGameModeHandler = (gameMode) => {
        return `${gameMode[0].toUpperCase()}${gameMode.slice(1, -4)} ${gameMode.slice(-4)}`
    }

    const mainTemplateStyles = {
        display: 'flex',
        padding: '20px',
    }

    const squareTemplateStyles = {
        display: gameStartTrigger ? 'grid' : 'none',
        gridTemplateColumns: `repeat(${gameFieldSize}, 50px`,
        gridTemplateRows: `repeat(${gameFieldSize}, 50px)`,
    }

    const gameSectionTemplateStyles = {
        display: 'flex',
        flexDirection: 'column',
        paddingRight: '20px',
    }

    const hoveredSquaresSectionTemplateStyles = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(20px, 1fr)',
        alignItems: 'center',
        maxWidth: '515px',
        gridGap: '5px',
    }

    const hoveredCoordinatesStyles = {
        display: 'grid',
        backgroundColor: 'lemonchiffon',
        minHeight: '20px',
        fontSize: '10px',
        alignItems: 'center',
        gridTemplateColumns: '1fr 1fr',
    }

    const selectGameModeStyles = {
        display: 'flex',
        paddingBottom: '20px',
    }

    const hoveredSectionHeaderStyles = {
        display: 'grid',
        width: '100%',
        gridColumn: '1 / span all',
    }

    const selectStyles = {
        marginRight: '20px',
        cursor: 'pointer',
    }

    const startButtonStyles = {
        textTransform: 'upperCase',
        backgroundColor: 'lightblue',
        fontStyle: 'bold',
        border: 'none',
        minWidth: '100px',
        minHeight: '25px',
        borderRadius: '5px',
        cursor: currentGameMode === 'modeIsNotChosen' ? 'not-allowed' : 'pointer',
    }

    return (
        <div style={mainTemplateStyles}>
            <section style={gameSectionTemplateStyles}>
                <div style={selectGameModeStyles}>
                    <select
                        style={selectStyles}
                        onChange={evt => {
                            setCurrentGameMode(evt.target.value);
                            setSquareCoordinates([]);
                        }}
                    >
                        {currentGameMode === 'modeIsNotChosen' && <option value={'modeIsNotChosen'}>Pick mode</option>}
                        {allGameModes.map(gameMode => {
                            return (
                                <option
                                    value={gameMode}
                                    key={gameMode}
                                >
                                    {nameForGameModeHandler(gameMode)}
                                </option>
                            )
                        })}
                    </select>
                    <button
                        disabled={currentGameMode === 'modeIsNotChosen'}
                        style={startButtonStyles}
                        type='button'
                        onClick={() => {
                            setGameStartTrigger(true);
                            gameModeHandler(currentGameMode);
                            setSquareCoordinates([]);
                            setHoveredSquares([]);
                        }}
                    >
                        Start
                    </button>
                </div>
                <div style={squareTemplateStyles}>
                    {gameTemplate.map(section => {
                        let isHovered = false;
                        if (hoveredSquares.includes(section)) {
                            isHovered = true;
                        }
                        return (
                            <div
                                key={section}
                                onMouseEnter={() => hoverCardHandler(section)}
                                style={{border: '1px solid black', backgroundColor: isHovered ? 'blue' : 'white'}}>
                            </div>
                        )
                    })}
                </div>
            </section>
            {squareCoordinates.length > 0 && <section style={hoveredSquaresSectionTemplateStyles}>
                <h4 style={hoveredSectionHeaderStyles}>Hovered squares:</h4>
                {squareCoordinates.map(coordinates =>
                    <div
                        key={coordinates.coordinates}
                        style={hoveredCoordinatesStyles}>
                        <div>
                            { `Row ${coordinates.coordinates[0]}`}
                        </div>
                        <div>
                            { `Col ${coordinates.coordinates[1]}`}
                        </div>
                    </div>
                )}
            </section>}
        </div>
    )
}