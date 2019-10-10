import java.awt.Color;
import java.awt.Graphics;
import java.awt.GridLayout;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;

public class MainView {
	
	public JFrame 		frame;
	public JPanel 		panel;
	public JPanel 		canvas;
	public JLabel 		xSizeLabel;
	public JTextField 	xSizeInput;
	public JLabel 		ySizeLabel;
	public JTextField 	ySizeInput;	
	public JButton 		button1;
	public JButton 		button2;
	
	public MainView() {
		frame = new JFrame("Simpe Grain Growth");
		panel = new JPanel();
		canvas = new JPanel();
		xSizeLabel = new JLabel("X Size:");
		xSizeInput = new JTextField(10);
		ySizeLabel = new JLabel("Y Size:");
		ySizeInput = new JTextField(10);
		button1 = new JButton("XDDDDDD");
		button2 = new JButton("XDDD");
		
		panel.add(canvas);
		
		panel.add(canvas);
		panel.add(xSizeLabel);
		panel.add(xSizeInput);
		panel.add(ySizeLabel);
		panel.add(ySizeInput);
		panel.add(button1);
		
		frame.add(panel);
		frame.setLayout(new GridLayout(1, 2));
		frame.setSize(800, 900);
		frame.setLocation(200, 50);
		frame.setVisible(true);
	}
	
	public void paintComponent(Graphics g) {
		int width = 100;
	    int height = 100;
	    g.setColor(Color.black);
	    g.drawOval(0, 0, width, height);
	}
	
}
