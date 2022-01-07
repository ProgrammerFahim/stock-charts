import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import Chart from 'react-apexcharts';
import stock_options from './stock-options';
import './App.css';

const axios_options = {
    method: 'GET',
    url: 'https://stock-data-yahoo-finance-alternative.p.rapidapi.com/v8/finance/spark',
    params: {symbols: '', range: '1y', interval: '1mo'},
    headers: {
        'x-rapidapi-host': 'stock-data-yahoo-finance-alternative.p.rapidapi.com',
        'x-rapidapi-key': 'a89fe50197mshdb942d883e84990p167828jsn13928ba56764'
    }
};

const apex_options = {
    chart: {
        id: 'stock-chart',
        foreColor: '#000',
        toolbar: {
            autoSelected: 'pan',
            show: false
        }
    },
    colors: ['#0077B6'],
    stroke: {
        width: 3
    },
    grid: {
        borderColor: "#ddd",
        clipMarkers: true,
        yaxis: {
            lines: {
                show: true 
            }
        },
        row: {
            colors: ['#CAF0F8', 'transparent'],
            opacity: 0.2
        }
    },
    dataLabels: {
        enabled: false
    },
    fill: {
        gradient: {
            enabled: true,
            opacityFrom: 0.75,
            opacityTo: 0.45
        }
    },
    markers: {
        size: 5,
        strokeWidth: 3,
        colors: ['#FFFFFF'],
        strokeColor: '#0077B6'
    },
    tooltip: {
        theme: 'dark'
    },
    xaxis: {
        type: 'datetime'
    },
    yaxis: {
        opposite: true
    }
};

function App() {
    const [stock, setStock] = useState({});
    const [stockInfo, setStockInfo] = useState({});
    const [timeStamps, setTimeStamps] = useState([]);

    function selectNewStock(e) {
        axios_options.params.symbols = e.value;
        setStock(e);
    }
    
    useEffect(() => { 
        if (Object.keys(stock).length !== 0) {  
            axios.request(axios_options).then(function (response) {
                let stockData = response.data[stock.value];
                if (stockData['timestamp'].length === 13) {
                    stockData['timestamp'].pop();
                    stockData['close'].pop();
                }
                setStockInfo(stockData);
            }).catch(function (error) {
                console.error(error);
            });
        }
    }, [stock]);

    useEffect(() => {
        if (Object.keys(stockInfo).length !== 0) { 
            let ts = stockInfo["timestamp"].map((timestamp, idx) => {
                return [timestamp * 1000, stockInfo['close'][idx]]; 
            });
            setTimeStamps(ts);
        }
    }, [stockInfo]);

    return (
        <div className="App">
            <header className="header">
                <h1>STOCK<span>CHARTS</span></h1>
            </header>
            <div className="select-stock">
                <div><p>Select stock to retrieve yearly data</p></div>
                <Select 
                    options={stock_options}
                    onChange={selectNewStock}
                    isClearable={false}/>
            </div>

            <div className="show-stock">
                {Object.keys(stock).length !== 0 &&
                    <h1>{stock.label} ({stock.value})</h1>
                }

                {Object.keys(stock).length !== 0 && 
                    <Chart
                        options={apex_options}
                        series={[
                            {
                                name: "stock price", 
                                data: timeStamps
                            }
                        ]}
                        type="area"
                    />
                }
            </div>
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} - Fahim Faisal</p>
            </footer>
        </div>
    );
}

export default App;
