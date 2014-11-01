<?php
require('config/init.php');
session_start();
 if(!isset($_SESSION['id']) || empty($_SESSION['id'])){
 	session_write_close();
	header("Location:logout.php");
 	exit;
}

$user_details = $db->getDetails($_SESSION['id']);

////////////////////////////////////////////////////////////////////

$tid = 0;
$title = '';
$articles;
//////////////////////////////////////////////////////////////////////
if(isset($_GET['tid']) && !empty($_GET['tid'])){
	$tid =  (int)$_GET['tid'];
	$title = $db->getTopicTitle($tid);
	if(!isset($title) || $title == ''){
		session_write_close();
		header("Location:profile.php");
		exit;
	}
	$articles = $db->getArticlesFor($tid);

	require("canvas-items.inc.php");
}else{
	session_write_close();
	header("Location:profile.php");
	exit;
}

session_write_close();
?>
<!DOCTYPE html>
<html>
    <head>
		<link rel="stylesheet" type="text/css" href="header.css">
		<link rel="stylesheet" type="text/css" href="layout2.css">
		<link rel="stylesheet" Cache-control="Public" type="text/css" href="http://fonts.googleapis.com/css?family=Merriweather Sans">
		 <script type="text/javascript" src="funcbundle.js"></script>
        <title><?php echo ucwords($title).' - SimStudy';?></title>    
	</head>
	
	<body onload="javascript:initialise()">
		<!-- include header html php -->
		<?php require('header.inc.php'); ?>
	
	<!-- #############MAIN CONTENT START##################### -->
	<div id="content">	
		<div class="page_center">
			<div class="incontent_box">
				<div id="page_title_box"><?php echo ucfirst($title);?></div>
			</div>


			
					<?php
					
					foreach($articles as $article){
						$article_string = '<div class="incontent_box">';
						$article_string .= '<div class="article_title_box"><h3>'.$article['article_title'].'</h3></div>';
						$article_string .= ''.$article['article_text'].'';
						$article_string .= '<div class="article_date_box"><span class="date_text">posted on '.date("F j, Y, g:i a", $article['time']).'</span></div>';
						$article_string .= '</div>';
						echo $article_string;
					}	
					?>	

			
		<!--content page_center</div>-->
		</div>


		<!-- include php for side menu -->
		<?php require('side-menu.inc.php'); ?>

	</div>

	<!-- include php for footer -->
	<?php require('footer.inc.php'); ?>

	<!-- #############MAIN CONTENT END######################## -->	
	<?php echo $js_string; ?>
	</body>
	<script>	
	<?php echo $js_string_globals; ?>

	// TODO fix/ tidy up inits
	function initialise(){
		<?php echo $js_string_inits; ?>
	};
	  
		<?php echo $js_string_renderers;?>
    
        </script>
		

 </html>


	