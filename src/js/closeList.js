document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('objectPanel').style.display = 'none';
    document.getElementById('openButton').style.display = 'block';
});

document.getElementById('openButton').addEventListener('click', function() {
    document.getElementById('objectPanel').style.display = 'block';
    document.getElementById('openButton').style.display = 'none';
});