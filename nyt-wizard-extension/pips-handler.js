class PipsHandler
{
    getData()
    {
        const cells = document.getElementsByClassName("RegionCell-module_regionCell__wR6fp");

        for (let cell of cells)
        {
            if (cell.classList.contains("RegionCell-module_hidden__N_pYa")) continue;
        }
    }

    inputData(layout)
    {

    }
}