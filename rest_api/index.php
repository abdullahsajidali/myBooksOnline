<?php

// Session Variable
session_start(); // Starting Session

if(isset($_POST['action']) && !empty($_POST['action'])) 
{
    $action = $_POST['action'];
    $action();
}

function getBooks()
{
	$db_Object = getDbConnection();
	$stmt = $db_Object->prepare("SELECT  isbn, title, author_name, genre, price FROM books"); 
    $stmt->execute();
	if($stmt->rowCount() > 0)
	{
		$result = $stmt->fetchAll();
		$result = json_encode($result);
	}
	else
	{
		$result = null;
	}
	header('Content-type: application/json');
	echo $result;
}

//Current User's Wish List
function getWishList()
{
	$usr = $_POST['User'];
	
	$db_Object = getDbConnection();
	$stmt = $db_Object->prepare("SELECT b.isbn, b.title,b.author_name, b.genre, b.price FROM wishlist AS w,books AS b WHERE w.item_id=b.isbn && w.user_email='$usr'"); 
    $stmt->execute();
	//$result = $stmt->fetchAll();
	//print"<pre>";
	//print_r($result);

	
	if($stmt->rowCount() > 0)
	{
		$result = $stmt->fetchAll();
		$result = json_encode($result);
	}
	else
	{
		$result = null;
	}
	header('Content-type: application/json');
	echo $result;
	
}


function validateUser()
{
	// get post values
	$em = $_POST['Email'];
	$ps = $_POST['Password'];

	$db_Object = getDbConnection();
	$stmt = $db_Object->prepare("select email, password, isAdmin from users where email = '$em' and password= '$ps'");
	$stmt->execute();
    
	//print("Fetch all of the remaining rows in the result set:\n");
	$result = $stmt->fetchAll();
	//print("pre");
	//print_r($result);
	
	if($stmt->rowCount() == 1)
	{
		session_destroy();
		$_SESSION['login_user']=$result[0]['email']; // Initializing Session
		$_SESSION['isAdmin']=$result[0]['isAdmin'];
		$_SESSION['status'] = 'success';
		/* Working
		$response_array['login_user'] = $result[0]['email'];
		$response_array['isAdmin'] = $result[0]['isAdmin'];
		$response_array['status'] = 'success'; 
		*/
		
		//echo true;
	}
	else 
	{
		$_SESSION['login_user']=null; // Initializing Session
		$_SESSION['isAdmin']=null;
		$_SESSION['status'] = 'error';
		/* Working
		$response_array['login_user'] = null;
		$response_array['isAdmin'] = 0;
		$response_array['status'] = 'error'; 
		*/
		
	//echo false;
	}

	header('Content-type: application/json');
	echo json_encode($_SESSION);
}

// Registers a new user
function insertUser()
{
	// get post values
	$nm = $_POST['Name'];
	$em = $_POST['Email'];
	$ps = $_POST['Password'];
		 
	//generate sql query to be executed	
	$sql = "INSERT INTO users (name, email, password, isAdmin) VALUES ('$nm', '$em', '$ps', 0)";
		
	// Connect to database & execute above query
		$db_Object = getDbConnection();
		if( $db_Object->exec($sql) )
		{
			 $response_array['status'] = 'success'; 
		}
		else
		{
			 $response_array['status'] = 'error'; 
		}
	
	// finally return the responce to the user
	header('Content-type: application/json');
    echo json_encode($response_array);
}

function insertItem()
{
	// get post values
	$isbn = $_POST['Isbn'];
	$tit = $_POST['Title'];
	$aut = $_POST['Author'];
	$gen = $_POST['Genre'];
	$itm = $_POST['Item'];
	$img = $_POST['Image'];
	if($isbn==null)
	{
	
	}
	else{
	$db_Object = getDbConnection();
	$sql = "INSERT INTO books (isbn, title,author_name, genre, image) VALUES ('$isbn', '$tit', '$aut', '$gen', '$img')";
	$db_Object->exec($sql);
	}
}
 
function getDbConnection()
{
	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "mybooksonline";

	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	return $conn;
}
 
// ADD new Item to Wishlist

function addItemToWishlist()
{
	$item = $_POST['Isbn'];
	$user = $_POST['User'];
	if($item==null || $user==null)
		{
			$response_array['status'] = 'error';
		}
	else
		{
			$sql = "INSERT INTO wishlist (item_id, user_email, item_type) VALUES ('$item', '$user', 'book')";
		
			$db_Object = getDbConnection();
			if( $db_Object->exec($sql) )
			{
				 $response_array['status'] = 'success';
			}
			else
			{
				$response_array['status'] = 'error';
			}
		}

	// finally return the responce to the user
	header('Content-type: application/json');
    echo json_encode($response_array);
} 
 

function removeItemFromWishlist()
{
	$item = $_POST['Isbn'];
	$user = $_POST['User'];
	if($item==null || $user==null)
		{
			$response_array['status'] = 'error';
		}
	else
		{
			$sql = "DELETE FROM wishlist WHERE item_id = '$item' AND user_email = '$user'";
		
			$db_Object = getDbConnection();
			if( $db_Object->exec($sql) )
			{
				 $response_array['status'] = 'success';
			}
			else
			{
				$response_array['status'] = 'error';
			}
		}

	// finally return the responce to the user
	header('Content-type: application/json');
    echo json_encode($response_array);
}  




	// GET Working fine
	/*
	$stmt = $conn->prepare("SELECT id, isbn, author_name, description FROM book"); 
    $stmt->execute();
	
	
    // set the resulting array to associative
 //   $result = $stmt->setFetchMode(PDO::FETCH_ASSOC); 
//	$json_response = json_encode($result);
	
	$results=$stmt->fetchAll(PDO::FETCH_ASSOC);
	$json=json_encode($results);
	//print_r($json);
	echo $json;
	
	//echo $json_response;
	//var_dump($result);
	//return $result;
	/*
    foreach(new TableRows(new RecursiveArrayIterator($stmt->fetchAll())) as $k=>$v) 
	{ 
        echo $v;
    }
	*/
	
	////////////////////////////////////////////////////////////////////////////////
	

	// POST Working fine
	/*
	$sql = "INSERT INTO book (isbn, author_name, description) VALUES ('new 1', 'new 1', 'new 1')";
	$stmt = $conn->prepare($sql);
		
	$stmt->execute();
	
	
	// OR WE CAN USE THIS
	
	
	
	$isb = $_POST['isbn'];
	$aut = $_POST['author_name'];
	$des = $_POST['description'];
	
	
	$sql = "INSERT INTO book (isbn, author_name, description) VALUES ('$isb', '$aut', '$des')";
	$conn->exec($sql);
	
	*/
	
	
	// http://stackoverflow.com/questions/25677368/calling-a-specific-function-from-php-with-jquery-ajax